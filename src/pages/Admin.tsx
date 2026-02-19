import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  ChevronRight,
  FlaskConical,
  GraduationCap,
  Loader2,
  LogOut,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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
}

type Filter = "all" | "counseling" | "research";

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
/*  Expanded row detail                                                */
/* ------------------------------------------------------------------ */

function SubmissionDetail({ s }: { s: Submission }) {
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
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 px-4 pb-4 pt-1">
      {fields
        .filter((f) => f.value)
        .map((f) => (
          <div key={f.label}>
            <div className="text-xs font-medium text-muted-foreground">{f.label}</div>
            <div className="mt-0.5 text-sm">{f.value}</div>
          </div>
        ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    const token = getAuth();
    if (!token) {
      onLogout();
      return;
    }
    try {
      const res = await fetch("/api/admin/submissions", {
        headers: { Authorization: `Basic ${token}` },
      });
      if (res.status === 401) {
        clearAuth();
        onLogout();
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setSubmissions(data);
    } catch {
      setError("Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filtered = submissions.filter((s) => {
    if (filter === "counseling") return s.program === "College Counseling";
    if (filter === "research") return s.program === "Research Program";
    return true;
  });

  const counselingCount = submissions.filter((s) => s.program === "College Counseling").length;
  const researchCount = submissions.filter((s) => s.program === "Research Program").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Launchpad Prep"
              className="h-8 w-8 rounded-xl object-contain"
            />
            <span className="font-serif text-base">Submissions</span>
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

      <main className="mx-auto max-w-6xl px-5 py-8">
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

        {/* Filter tabs */}
        <div className="mb-4 flex gap-1 rounded-xl bg-muted/50 p-1 w-fit">
          {([
            { key: "all" as Filter, label: "All" },
            { key: "counseling" as Filter, label: "Counseling" },
            { key: "research" as Filter, label: "Research" },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm font-medium transition-all",
                filter === tab.key
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Table */}
        {loading && submissions.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Loading submissions…
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            No submissions yet.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border">
            {/* Table header */}
            <div className="hidden sm:grid sm:grid-cols-[2fr_1.2fr_1fr_1fr_0.8fr] gap-4 border-b bg-muted/30 px-4 py-3 text-xs font-medium text-muted-foreground">
              <div>Student</div>
              <div>Program</div>
              <div>Grade</div>
              <div>School</div>
              <div>Date</div>
            </div>

            {/* Rows */}
            {filtered.map((s) => {
              const isOpen = expandedId === s.id;
              return (
                <div key={s.id} className="border-b last:border-b-0">
                  <button
                    onClick={() => setExpandedId(isOpen ? null : s.id)}
                    className="flex w-full items-center gap-4 px-4 py-3.5 text-left transition-colors hover:bg-muted/20 sm:grid sm:grid-cols-[2fr_1.2fr_1fr_1fr_0.8fr]"
                  >
                    {/* Student */}
                    <div className="min-w-0 flex-1 sm:flex-none">
                      <div className="flex items-center gap-2">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                        )}
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{s.student_name}</div>
                          <div className="truncate text-xs text-muted-foreground sm:hidden">
                            {s.program}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Program */}
                    <div className="hidden sm:flex items-center gap-1.5">
                      {s.program === "College Counseling" ? (
                        <GraduationCap className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                      ) : (
                        <FlaskConical className="h-3.5 w-3.5 text-[hsl(var(--primary))]" />
                      )}
                      <span className="text-sm">{s.program}</span>
                    </div>

                    {/* Grade */}
                    <div className="hidden text-sm sm:block">{s.student_grade}</div>

                    {/* School */}
                    <div className="hidden text-sm truncate sm:block">{s.school}</div>

                    {/* Date */}
                    <div className="hidden text-xs text-muted-foreground sm:block">
                      {formatDate(s.created_at)}
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {isOpen && (
                    <div className="border-t bg-muted/10">
                      <SubmissionDetail s={s} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
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
