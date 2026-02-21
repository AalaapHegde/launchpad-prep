import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  FlaskConical,
  GraduationCap,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

/* ------------------------------------------------------------------ */
/*  Types & constants                                                  */
/* ------------------------------------------------------------------ */

type Program = "counseling" | "research";

interface FormData {
  program: Program | "";
  name: string;
  email: string;
  grade: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  school: string;
  state: string;
  // Counseling-specific
  major: string;
  extracurriculars: string;
  interests: string;
  // Research-specific
  topics: string;
  ideas: string;
}

const INITIAL: FormData = {
  program: "",
  name: "",
  email: "",
  grade: "",
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  school: "",
  state: "",
  major: "",
  extracurriculars: "",
  interests: "",
  topics: "",
  ideas: "",
};

const GRADES = [
  "8th Grade",
  "9th Grade (Freshman)",
  "10th Grade (Sophomore)",
  "11th Grade (Junior)",
  "12th Grade (Senior)",
];

const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  0: ["program"],
  1: ["name", "email", "grade", "parentName", "parentEmail", "parentPhone"],
  // Step 2 depends on program — resolved dynamically
};

function getStep2Fields(program: Program | ""): (keyof FormData)[] {
  const shared: (keyof FormData)[] = ["school", "state"];
  if (program === "counseling") return [...shared, "major", "extracurriculars", "interests"];
  if (program === "research") return [...shared, "topics", "ideas"];
  return shared;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(field: keyof FormData, value: string): string | null {
  if (!value.trim()) return "This field is required.";
  if ((field === "email" || field === "parentEmail") && !EMAIL_RE.test(value))
    return "Please enter a valid email address.";
  if (field === "parentPhone" && value.replace(/\D/g, "").length < 10)
    return "Please enter a valid phone number (at least 10 digits).";
  if (field === "grade" && !GRADES.includes(value)) return "Please select a grade.";
  return null;
}

/* ------------------------------------------------------------------ */
/*  Field labels                                                       */
/* ------------------------------------------------------------------ */

const LABELS: Record<string, string> = {
  name: "Student name",
  email: "Student email",
  grade: "Student grade",
  parentName: "Parent / guardian name",
  parentEmail: "Parent / guardian email",
  parentPhone: "Parent / guardian phone",
  school: "Current school",
  state: "State",
  major: "Intended major(s)",
  extracurriculars: "Extracurricular activities",
  interests: "Academic interests & goals",
  topics: "Research topics of interest",
  ideas: "Any specific research ideas?",
};

/* ------------------------------------------------------------------ */
/*  Slide variants                                                     */
/* ------------------------------------------------------------------ */

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            i === current
              ? "w-6 bg-[hsl(var(--primary))]"
              : i < current
                ? "w-2 bg-[hsl(var(--primary))]/60"
                : "w-2 bg-muted-foreground/25"
          )}
        />
      ))}
    </div>
  );
}

function FieldError({ error }: { error?: string | null }) {
  if (!error) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {error}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ConsultationForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1); // 1 = forward, -1 = back
  const [data, setData] = useState<FormData>(INITIAL);
  const [touched, setTouched] = useState<Set<keyof FormData>>(new Set());
  const [submitAll, setSubmitAll] = useState(false); // true when Next/Submit pressed on current step
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  /* ---- helpers ---- */

  const set = useCallback(
    (field: keyof FormData, value: string) =>
      setData((prev) => ({ ...prev, [field]: value })),
    []
  );

  const touch = useCallback(
    (field: keyof FormData) => setTouched((prev) => new Set(prev).add(field)),
    []
  );

  const fieldsForStep = useCallback(
    (s: number): (keyof FormData)[] => {
      if (s === 2) return getStep2Fields(data.program);
      return STEP_FIELDS[s] ?? [];
    },
    [data.program]
  );

  const errorsForStep = useCallback(
    (s: number): Map<keyof FormData, string> => {
      const errs = new Map<keyof FormData, string>();
      for (const f of fieldsForStep(s)) {
        const e = validate(f, data[f]);
        if (e) errs.set(f, e);
      }
      return errs;
    },
    [data, fieldsForStep]
  );

  const showError = useCallback(
    (field: keyof FormData) => {
      if (!submitAll && !touched.has(field)) return null;
      return validate(field, data[field]);
    },
    [data, touched, submitAll]
  );

  /* ---- navigation ---- */

  const goNext = () => {
    setSubmitAll(true);
    const errs = errorsForStep(step);
    if (errs.size > 0) return;
    setSubmitAll(false);
    setDir(1);
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setSubmitAll(false);
    setDir(-1);
    setStep((s) => s - 1);
  };

  /* ---- submission ---- */

  const handleSubmit = async () => {
    setSubmitAll(true);
    const errs = errorsForStep(step);
    if (errs.size > 0) return;

    setStatus("submitting");

    const body: Record<string, string> = {
      Program: data.program === "counseling" ? "College Counseling" : "Research Program",
      "Student Name": data.name,
      "Student Email": data.email,
      "Student Grade": data.grade,
      "Parent Name": data.parentName,
      "Parent Email": data.parentEmail,
      "Parent Phone": data.parentPhone,
      School: data.school,
      State: data.state,
    };

    if (data.program === "counseling") {
      body["Intended Major(s)"] = data.major;
      body["Extracurriculars"] = data.extracurriculars;
      body["Interests & Goals"] = data.interests;
    } else {
      body["Research Topics"] = data.topics;
      body["Research Ideas"] = data.ideas;
    }

    // FormSubmit hidden fields
    body["_subject"] = `New ${body.Program} inquiry from ${data.name}`;
    body["_cc"] = "launchpadprep0@gmail.com,vishnuveeravalli23@gmail.com";
    body["_captcha"] = "false";

    try {
      const res = await fetch("https://formsubmit.co/ajax/aalaaphegde@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Network error");

      // Also save to Supabase for the admin panel
      if (supabase) {
        await supabase.from("submissions").insert({
          program: data.program === "counseling" ? "College Counseling" : "Research Program",
          student_name: data.name,
          student_email: data.email,
          student_grade: data.grade,
          parent_name: data.parentName,
          parent_email: data.parentEmail,
          parent_phone: data.parentPhone,
          school: data.school,
          state: data.state,
          major: data.major || null,
          extracurriculars: data.extracurriculars || null,
          interests: data.interests || null,
          topics: data.topics || null,
          ideas: data.ideas || null,
        });
      }

      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  /* ---- terminal states ---- */

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10">
          <Check className="h-7 w-7 text-[hsl(var(--primary))]" />
        </div>
        <h3 className="font-serif text-2xl md:text-3xl">Application submitted!</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thank you — we'll review your information and get back to you within 1–2 business days.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <h3 className="font-serif text-2xl md:text-3xl">Something went wrong</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          We couldn't submit your application. Please try again or email us directly.
        </p>
        <Button
          variant="outline"
          className="mt-2 rounded-2xl"
          onClick={() => setStatus("idle")}
        >
          Try again
        </Button>
      </div>
    );
  }

  /* ---- shared input builder ---- */

  const inputCls = (field: keyof FormData) =>
    cn(
      "w-full rounded-xl border bg-background px-4 py-2.5 text-sm outline-none transition-all",
      "focus:ring-2 focus:ring-offset-0",
      showError(field)
        ? "border-destructive focus:ring-destructive/30"
        : "border-border focus:ring-[hsl(var(--primary))]/30"
    );

  const renderField = (field: keyof FormData) => {
    const label = LABELS[field] ?? field;
    const err = showError(field);

    if (field === "grade") {
      return (
        <div key={field}>
          <label className="mb-1.5 block text-sm font-medium">{label}</label>
          <select
            className={inputCls(field)}
            value={data[field]}
            onChange={(e) => set(field, e.target.value)}
            onBlur={() => touch(field)}
          >
            <option value="">Select grade…</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
          <FieldError error={err} />
        </div>
      );
    }

    // Textarea for longer fields
    if (["extracurriculars", "interests", "topics", "ideas"].includes(field)) {
      return (
        <div key={field} className="col-span-full">
          <label className="mb-1.5 block text-sm font-medium">{label}</label>
          <textarea
            className={cn(inputCls(field), "min-h-[80px] resize-y")}
            value={data[field]}
            onChange={(e) => set(field, e.target.value)}
            onBlur={() => touch(field)}
            rows={3}
          />
          <FieldError error={err} />
        </div>
      );
    }

    return (
      <div key={field}>
        <label className="mb-1.5 block text-sm font-medium">{label}</label>
        <input
          type={
            field === "email" || field === "parentEmail"
              ? "email"
              : field === "parentPhone"
                ? "tel"
                : "text"
          }
          className={inputCls(field)}
          value={data[field]}
          onChange={(e) => set(field, e.target.value)}
          onBlur={() => touch(field)}
        />
        <FieldError error={err} />
      </div>
    );
  };

  /* ---- step content ---- */

  const stepContent = () => {
    if (step === 0) {
      return (
        <div className="space-y-4">
          <h3 className="font-serif text-2xl md:text-3xl">Which program are you interested in?</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {([
              {
                key: "counseling" as Program,
                label: "Profile Mentorship Program",
                desc: "Craft an exceptional profile in 6 months with your mentor.",
                Icon: GraduationCap,
              },
              {
                key: "research" as Program,
                label: "Research Program",
                desc: "Hands-on research mentorship with publication-quality outcomes.",
                Icon: FlaskConical,
              },
            ]).map(({ key, label, desc, Icon }) => {
              const selected = data.program === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("program", key)}
                  className={cn(
                    "group flex flex-col items-start gap-4 rounded-2xl border p-6 md:p-8 text-left transition-all",
                    selected
                      ? "border-[hsl(var(--primary))]/50 bg-[hsl(var(--primary))]/5 ring-1 ring-[hsl(var(--primary))]/20"
                      : "border-border hover:border-[hsl(var(--primary))]/30 hover:bg-[hsl(var(--primary))]/[0.02]"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-xl border transition-colors",
                      selected
                        ? "border-[hsl(var(--primary))]/30 bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                        : "border-border bg-background text-muted-foreground group-hover:text-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-medium">{label}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          {showError("program") && <FieldError error={showError("program")} />}
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="space-y-4">
          <h3 className="font-serif text-2xl md:text-3xl">Student & parent information</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {STEP_FIELDS[1].map(renderField)}
          </div>
        </div>
      );
    }

    // Step 2
    const fields = getStep2Fields(data.program);
    return (
      <div className="space-y-4">
        <h3 className="font-serif text-2xl md:text-3xl">
          {data.program === "counseling"
            ? "School & counseling details"
            : "School & research details"}
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">{fields.map(renderField)}</div>
      </div>
    );
  };

  const isLastStep = step === 2;

  return (
    <div className="flex flex-1 flex-col">
      {/* Step indicator + label */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <StepIndicator current={step} total={3} />
        <p className="text-xs font-medium text-muted-foreground">Step {step + 1} of 3</p>
      </div>

      {/* Step content — grows to fill space */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {stepContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation — pinned to bottom */}
      <div className="mt-10 flex items-center justify-between border-t pt-6">
        {step > 0 ? (
          <Button variant="ghost" className="rounded-2xl" onClick={goBack}>
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {isLastStep ? (
          <Button
            size="lg"
            className="rounded-2xl"
            onClick={handleSubmit}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                Submit application
                <Check className="ml-1.5 h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button size="lg" className="rounded-2xl" onClick={goNext}>
            Next
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
