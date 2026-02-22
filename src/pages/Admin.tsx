import React, { useState, useEffect, useCallback } from "react";
import {
  FlaskConical,
  GraduationCap,
  Loader2,
  LogOut,
  RefreshCw,
  Trash2,
  UserPlus,
  X,
  User,
} from "lucide-react";
import {
  DndContext,
  DragOverlay,
  useDroppable,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Mentor {
  id: number;
  created_at: string;
  name: string;
}

interface Submission {
  id: number;
  created_at: string;
  program: string;
  student_name: string;
  student_email: string;
  student_grade: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  school: string;
  state: string;
  major: string | null;
  extracurriculars: string | null;
  interests: string | null;
  topics: string | null;
  ideas: string | null;
  mentor_id: number | null;
  status: string;
}

type SubmissionStatus = "unmatched" | "matched" | "confirmed";
type ProgramFilter = "all" | "counseling" | "research";
type SortMode = "newest" | "oldest" | "priority";
type Tab = "submissions" | "mentors" | "majors";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getAuth(): string | null {
  return sessionStorage.getItem("admin_auth");
}

function setAuth(user: string, pass: string) {
  sessionStorage.setItem("admin_auth", btoa(`${user}:${pass}`));
}

function clearAuth() {
  sessionStorage.removeItem("admin_auth");
}

function authHeaders(): Record<string, string> {
  const token = getAuth();
  return token ? { Authorization: `Basic ${token}` } : {};
}

function daysWaiting(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

function computePriority(s: Submission): number {
  if (s.program === "College Counseling") {
    return (s.major?.length ?? 0) + (s.extracurriculars?.length ?? 0) + (s.interests?.length ?? 0);
  }
  return (s.topics?.length ?? 0) + (s.ideas?.length ?? 0);
}

function sortSubmissions(list: Submission[], mode: SortMode): Submission[] {
  return [...list].sort((a, b) => {
    if (mode === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    if (mode === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return computePriority(b) - computePriority(a);
  });
}

const COLUMN_CONFIG: { id: SubmissionStatus; label: string; color: string; bg: string }[] = [
  { id: "unmatched", label: "Unmatched", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30" },
  { id: "matched", label: "Matched", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30" },
  { id: "confirmed", label: "Confirmed", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30" },
];

/* ------------------------------------------------------------------ */
/*  Login screen                                                       */
/* ------------------------------------------------------------------ */

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const token = btoa(`${user}:${pass}`);
    try {
      const res = await fetch("/api/admin/submissions", {
        headers: { Authorization: `Basic ${token}` },
      });
      if (res.ok) {
        setAuth(user, pass);
        onLogin();
      } else {
        setError("Invalid username or password.");
      }
    } catch {
      setError("Could not connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[hsl(var(--primary))]/30";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <img
            src="/logo.png"
            alt="Launchpad Prep"
            className="mx-auto h-12 w-12 rounded-2xl object-contain"
          />
          <h1 className="mt-4 font-serif text-2xl">Admin Panel</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to view submissions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Username</label>
            <input
              className={inputCls}
              value={user}
              onChange={(e) => setUser(e.target.value)}
              autoComplete="username"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <input
              type="password"
              className={inputCls}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full rounded-2xl"
            disabled={loading || !user || !pass}
          >
            {loading ? (
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
            ) : null}
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Student card (draggable)                                           */
/* ------------------------------------------------------------------ */

function StudentCard({
  submission,
  mentorName,
  onClick,
}: {
  submission: Submission;
  mentorName: string | null;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: submission.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "cursor-grab rounded-xl border bg-card p-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
    >
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="truncate text-sm font-medium">{submission.student_name}</span>
          <div className="flex items-center gap-1">
            {submission.program === "College Counseling" ? (
              <GraduationCap className="h-3 w-3 shrink-0 text-[hsl(var(--primary))]" />
            ) : (
              <FlaskConical className="h-3 w-3 shrink-0 text-[hsl(var(--primary))]" />
            )}
            <span className="truncate text-xs text-muted-foreground">
              {submission.program === "College Counseling" ? "Counseling" : "Research"}
            </span>
          </div>
        </div>
        {(submission.program === "College Counseling" ? submission.major : submission.topics) && (
          <div className="mt-0.5 truncate text-xs text-muted-foreground">
            {submission.program === "College Counseling" ? submission.major : submission.topics}
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
        {submission.school && <span className="truncate">{submission.school}</span>}
        {submission.state && <span>{submission.state}</span>}
      </div>
      {mentorName && (
        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-blue-50 px-2 py-1 dark:bg-blue-950/30">
          <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          <span className="truncate text-xs font-medium text-blue-700 dark:text-blue-300">
            {mentorName}
          </span>
        </div>
      )}
      <div className="mt-2 flex justify-end">
        <span className="shrink-0 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-red-700 dark:bg-red-900/40 dark:text-red-400">
          {daysWaiting(submission.created_at)}d
        </span>
      </div>
    </div>
  );
}

/** Static card used in the drag overlay (no sortable hooks). */
function StudentCardStatic({
  submission,
  mentorName,
}: {
  submission: Submission;
  mentorName: string | null;
}) {
  return (
    <div className="cursor-grabbing rounded-xl border bg-card p-3 shadow-lg ring-2 ring-[hsl(var(--primary))]/30">
      <div className="min-w-0">
        <div className="flex items-baseline gap-1.5">
          <span className="truncate text-sm font-medium">{submission.student_name}</span>
          <div className="flex items-center gap-1">
            {submission.program === "College Counseling" ? (
              <GraduationCap className="h-3 w-3 shrink-0 text-[hsl(var(--primary))]" />
            ) : (
              <FlaskConical className="h-3 w-3 shrink-0 text-[hsl(var(--primary))]" />
            )}
            <span className="truncate text-xs text-muted-foreground">
              {submission.program === "College Counseling" ? "Counseling" : "Research"}
            </span>
          </div>
        </div>
        {(submission.program === "College Counseling" ? submission.major : submission.topics) && (
          <div className="mt-0.5 truncate text-xs text-muted-foreground">
            {submission.program === "College Counseling" ? submission.major : submission.topics}
          </div>
        )}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
        {submission.school && <span className="truncate">{submission.school}</span>}
        {submission.state && <span>{submission.state}</span>}
      </div>
      {mentorName && (
        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-blue-50 px-2 py-1 dark:bg-blue-950/30">
          <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
          <span className="truncate text-xs font-medium text-blue-700 dark:text-blue-300">
            {mentorName}
          </span>
        </div>
      )}
      <div className="mt-2 flex justify-end">
        <span className="shrink-0 rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-semibold leading-none text-red-700 dark:bg-red-900/40 dark:text-red-400">
          {daysWaiting(submission.created_at)}d
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Kanban column                                                      */
/* ------------------------------------------------------------------ */

function KanbanColumn({
  config,
  submissions,
  mentorMap,
  onCardClick,
}: {
  config: (typeof COLUMN_CONFIG)[number];
  submissions: Submission[];
  mentorMap: Record<number, string>;
  onCardClick: (s: Submission) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: `column-${config.id}`,
    data: { type: "column", status: config.id },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex min-h-0 flex-1 flex-col rounded-2xl border bg-muted/20"
    >
      {/* Column header */}
      <div className={cn("flex items-center gap-2 rounded-t-2xl px-4 py-3", config.bg)}>
        <h3 className={cn("text-sm font-semibold", config.color)}>
          {config.label}
        </h3>
        <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", config.bg, config.color)}>
          {submissions.length}
        </span>
      </div>

      {/* Scrollable card list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ maxHeight: "calc(100vh - 320px)" }}>
        <SortableContext
          items={submissions.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          {submissions.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">
              No students
            </div>
          ) : (
            submissions.map((s) => (
              <StudentCard
                key={s.id}
                submission={s}
                mentorName={s.mentor_id ? mentorMap[s.mentor_id] ?? null : null}
                onClick={() => onCardClick(s)}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mentor picker modal                                                */
/* ------------------------------------------------------------------ */

function MentorPickerModal({
  mentors,
  onConfirm,
  onCancel,
}: {
  mentors: Mentor[];
  onConfirm: (mentorId: number) => void;
  onCancel: () => void;
}) {
  const [selected, setSelected] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg">Assign Mentor</h3>
          <button onClick={onCancel} className="rounded-lg p-1 hover:bg-muted">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Select a mentor to assign to this student.
        </p>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30"
        >
          <option value="">Select mentor...</option>
          {mentors.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <div className="mt-4 flex gap-2 justify-end">
          <Button
            variant="ghost"
            className="rounded-xl"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            className="rounded-xl"
            disabled={!selected}
            onClick={() => onConfirm(Number(selected))}
          >
            Assign
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Student detail modal                                               */
/* ------------------------------------------------------------------ */

function StudentDetailModal({
  submission,
  mentorName,
  onClose,
}: {
  submission: Submission;
  mentorName: string | null;
  onClose: () => void;
}) {
  const s = submission;

  const fields: { label: string; value: string | null }[] = [
    { label: "Student email", value: s.student_email },
    { label: "Grade", value: s.student_grade },
    { label: "Parent name", value: s.parent_name },
    { label: "Parent email", value: s.parent_email },
    { label: "Parent phone", value: s.parent_phone },
    { label: "School", value: s.school },
    { label: "State", value: s.state },
  ];

  if (s.program === "College Counseling") {
    fields.push(
      { label: "Intended major(s)", value: s.major },
      { label: "Extracurriculars", value: s.extracurriculars },
      { label: "Interests & goals", value: s.interests }
    );
  } else {
    fields.push(
      { label: "Research topics", value: s.topics },
      { label: "Research ideas", value: s.ideas }
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl border bg-card p-6 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-serif text-lg">{s.student_name}</h3>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {s.program === "College Counseling" ? (
                  <GraduationCap className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                ) : (
                  <FlaskConical className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                )}
                <span className="text-sm text-muted-foreground">{s.program}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(s.created_at)}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 hover:bg-muted">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Status badge */}
        <div className="mb-4 flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              s.status === "unmatched" && "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
              s.status === "matched" && "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
              s.status === "confirmed" && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            )}
          >
            {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
          </span>
          {mentorName && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
              <User className="h-3 w-3" />
              {mentorName}
            </span>
          )}
        </div>

        {/* Fields */}
        <div className="grid gap-3 sm:grid-cols-2">
          {fields
            .filter((f) => f.value)
            .map((f) => (
              <div key={f.label}>
                <div className="text-xs font-medium text-muted-foreground">{f.label}</div>
                <div className="mt-0.5 text-sm">{f.value}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Mentors tab                                                        */
/* ------------------------------------------------------------------ */

function MentorsPanel() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const fetchMentors = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/mentors", { headers: authHeaders() });
      if (res.ok) setMentors(await res.json());
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMentors();
  }, [fetchMentors]);

  const addMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setAdding(true);
    setError("");
    try {
      const res = await fetch("/api/admin/mentors", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error("Failed");
      const mentor = await res.json();
      setMentors((prev) => [mentor, ...prev]);
      setName("");
    } catch {
      setError("Failed to add mentor.");
    } finally {
      setAdding(false);
    }
  };

  const deleteMentor = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/mentors?id=${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) setMentors((prev) => prev.filter((m) => m.id !== id));
    } catch {
      /* ignore */
    }
  };

  return (
    <div>
      {/* Add mentor form */}
      <form onSubmit={addMentor} className="mb-6 flex gap-2">
        <input
          placeholder="Mentor name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:ring-2 focus:ring-[hsl(var(--primary))]/30"
        />
        <Button
          type="submit"
          className="rounded-xl gap-1.5"
          disabled={adding || !name.trim()}
        >
          {adding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          Add
        </Button>
      </form>

      {error && (
        <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading mentors...
        </div>
      ) : mentors.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          No mentors yet. Add one above.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border">
          {mentors.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between border-b px-4 py-3 last:border-b-0"
            >
              <div>
                <div className="text-sm font-medium">{m.name}</div>
                <div className="text-xs text-muted-foreground">
                  Added {formatDate(m.created_at)}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-xl text-muted-foreground hover:text-destructive"
                onClick={() => deleteMentor(m.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Majors tab                                                         */
/* ------------------------------------------------------------------ */

function MajorsPanel({ submissions }: { submissions: Submission[] }) {
  // Count occurrences of each major/topic across all submissions
  const counts: Record<string, number> = {};
  for (const s of submissions) {
    const raw = s.program === "College Counseling" ? s.major : s.topics;
    if (!raw) continue;
    // Split on commas, semicolons, slashes, or " and " to handle multi-value entries
    const parts = raw.split(/[,;/]| and /i).map((p) => p.trim()).filter(Boolean);
    for (const part of parts) {
      const key = part.toLowerCase();
      counts[key] = (counts[key] ?? 0) + 1;
    }
  }

  const top6 = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <div>
      <h2 className="mb-4 font-serif text-lg">Top Majors / Research Topics</h2>
      {top6.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">
          No major or topic data yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Major / Topic</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Count</th>
              </tr>
            </thead>
            <tbody>
              {top6.map(([name, count], i) => (
                <tr key={name} className="border-b last:border-b-0">
                  <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                  <td className="px-4 py-3 capitalize">{name}</td>
                  <td className="px-4 py-3 text-right font-medium">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("submissions");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [programFilter, setProgramFilter] = useState<ProgramFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("newest");

  // Drag state
  const [activeId, setActiveId] = useState<number | null>(null);

  // Mentor picker modal state
  const [pendingDrop, setPendingDrop] = useState<{
    submissionId: number;
  } | null>(null);

  // Detail modal state
  const [detailSubmission, setDetailSubmission] = useState<Submission | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = getAuth();
    if (!token) {
      onLogout();
      return;
    }
    const headers = { Authorization: `Basic ${token}` };
    try {
      const [subRes, mentorRes] = await Promise.all([
        fetch("/api/admin/submissions", { headers }),
        fetch("/api/admin/mentors", { headers }),
      ]);
      if (subRes.status === 401) {
        clearAuth();
        onLogout();
        return;
      }
      if (!subRes.ok) throw new Error("Failed to fetch");
      setSubmissions(await subRes.json());
      if (mentorRes.ok) setMentors(await mentorRes.json());
    } catch {
      setError("Failed to load data.");
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const mentorMap = Object.fromEntries(mentors.map((m) => [m.id, m.name]));

  // Filter submissions by program
  const filtered = submissions.filter((s) => {
    if (programFilter === "counseling" && s.program !== "College Counseling") return false;
    if (programFilter === "research" && s.program !== "Research Program") return false;
    return true;
  });

  // Bucket into columns (with sort applied)
  const columns: Record<SubmissionStatus, Submission[]> = {
    unmatched: sortSubmissions(filtered.filter((s) => s.status === "unmatched"), sortMode),
    matched: sortSubmissions(filtered.filter((s) => s.status === "matched"), sortMode),
    confirmed: sortSubmissions(filtered.filter((s) => s.status === "confirmed"), sortMode),
  };

  const counselingCount = submissions.filter((s) => s.program === "College Counseling").length;
  const researchCount = submissions.filter((s) => s.program === "Research Program").length;

  // --- API call to update status ---
  const updateStatus = async (
    submissionId: number,
    status: SubmissionStatus,
    mentorId?: number
  ) => {
    try {
      const body: Record<string, any> = { submission_id: submissionId, status };
      if (mentorId !== undefined) body.mentor_id = mentorId;
      const res = await fetch("/api/admin/match", {
        method: "POST",
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Failed");
      const updated = await res.json();
      setSubmissions((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch {
      // Revert optimistic update on failure by re-fetching
      fetchData();
    }
  };

  // --- Drag handlers ---
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const submissionId = active.id as number;
    const submission = submissions.find((s) => s.id === submissionId);
    if (!submission) return;

    // Determine target column: could be dropping on another card or on the column itself
    let targetStatus: SubmissionStatus | null = null;

    const overId = String(over.id);
    if (overId.startsWith("column-")) {
      targetStatus = overId.replace("column-", "") as SubmissionStatus;
    } else {
      // Dropped on a card — find which column that card is in
      const overSubmission = submissions.find((s) => s.id === over.id);
      if (overSubmission) {
        targetStatus = overSubmission.status as SubmissionStatus;
      }
    }

    if (!targetStatus || targetStatus === submission.status) return;

    // If moving to "matched" and no mentor yet, show mentor picker
    if (targetStatus === "matched" && !submission.mentor_id) {
      // Optimistically move the card
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === submissionId ? { ...s, status: "matched" } : s
        )
      );
      setPendingDrop({ submissionId });
      return;
    }

    // Optimistic update
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? {
              ...s,
              status: targetStatus!,
              mentor_id: targetStatus === "unmatched" ? null : s.mentor_id,
            }
          : s
      )
    );

    updateStatus(
      submissionId,
      targetStatus,
      targetStatus === "matched" && submission.mentor_id
        ? submission.mentor_id
        : undefined
    );
  };

  const handleMentorConfirm = (mentorId: number) => {
    if (!pendingDrop) return;
    const { submissionId } = pendingDrop;

    // Update optimistically with mentor
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? { ...s, status: "matched", mentor_id: mentorId }
          : s
      )
    );

    updateStatus(submissionId, "matched", mentorId);
    setPendingDrop(null);
  };

  const handleMentorCancel = () => {
    if (!pendingDrop) return;
    // Revert the optimistic move
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === pendingDrop.submissionId
          ? { ...s, status: "unmatched" }
          : s
      )
    );
    setPendingDrop(null);
  };

  const activeSubmission = activeId
    ? submissions.find((s) => s.id === activeId) ?? null
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Launchpad Prep"
              className="h-8 w-8 rounded-xl object-contain"
            />
            {/* Tab navigation */}
            <div className="flex gap-1 rounded-xl bg-muted/50 p-1">
              {(
                [
                  { key: "submissions" as Tab, label: "Submissions" },
                  { key: "mentors" as Tab, label: "Mentors" },
                  { key: "majors" as Tab, label: "Majors" },
                ] as const
              ).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "rounded-lg px-3 py-1 text-sm font-medium transition-all",
                    tab === t.key
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl gap-1.5"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl gap-1.5"
              onClick={() => {
                clearAuth();
                onLogout();
              }}
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {/* ---- Mentors tab ---- */}
        {tab === "mentors" && <MentorsPanel />}

        {/* ---- Majors tab ---- */}
        {tab === "majors" && <MajorsPanel submissions={submissions} />}

        {/* ---- Submissions tab ---- */}
        {tab === "submissions" && (
          <>
            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              {[
                { label: "Total submissions", value: submissions.length, color: "text-foreground" },
                { label: "College Counseling", value: counselingCount, color: "text-[hsl(var(--primary))]" },
                { label: "Research Program", value: researchCount, color: "text-[hsl(var(--primary))]" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl border bg-card p-5">
                  <div className="text-xs font-medium text-muted-foreground">{stat.label}</div>
                  <div className={cn("mt-1 font-serif text-3xl", stat.color)}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Program filter + Sort */}
            <div className="mb-4 flex flex-wrap gap-3">
              <div className="flex gap-1 rounded-xl bg-muted/50 p-1 w-fit">
                {([
                  { key: "all" as ProgramFilter, label: "All" },
                  { key: "counseling" as ProgramFilter, label: "Counseling" },
                  { key: "research" as ProgramFilter, label: "Research" },
                ]).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setProgramFilter(f.key)}
                    className={cn(
                      "rounded-lg px-4 py-1.5 text-sm font-medium transition-all",
                      programFilter === f.key
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-1 rounded-xl bg-muted/50 p-1 w-fit">
                {([
                  { key: "newest" as SortMode, label: "Newest" },
                  { key: "oldest" as SortMode, label: "Oldest" },
                  { key: "priority" as SortMode, label: "Priority" },
                ]).map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSortMode(s.key)}
                    className={cn(
                      "rounded-lg px-4 py-1.5 text-sm font-medium transition-all",
                      sortMode === s.key
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Kanban board */}
            {loading && submissions.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-muted-foreground">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading submissions...
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {COLUMN_CONFIG.map((col) => (
                    <KanbanColumn
                      key={col.id}
                      config={col}
                      submissions={columns[col.id]}
                      mentorMap={mentorMap}
                      onCardClick={setDetailSubmission}
                    />
                  ))}
                </div>

                <DragOverlay>
                  {activeSubmission ? (
                    <StudentCardStatic
                      submission={activeSubmission}
                      mentorName={
                        activeSubmission.mentor_id
                          ? mentorMap[activeSubmission.mentor_id] ?? null
                          : null
                      }
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </>
        )}
      </main>

      {/* Mentor picker modal */}
      {pendingDrop && (
        <MentorPickerModal
          mentors={mentors}
          onConfirm={handleMentorConfirm}
          onCancel={handleMentorCancel}
        />
      )}

      {/* Student detail modal */}
      {detailSubmission && (
        <StudentDetailModal
          submission={detailSubmission}
          mentorName={
            detailSubmission.mentor_id
              ? mentorMap[detailSubmission.mentor_id] ?? null
              : null
          }
          onClose={() => setDetailSubmission(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(!!getAuth());

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return <Dashboard onLogout={() => setLoggedIn(false)} />;
}
