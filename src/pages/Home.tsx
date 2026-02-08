import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Check,
  Compass,
  FlaskConical,
  GraduationCap,
  Hammer,
  Menu,
  MessageSquare,
  PenLine,
  Search,
  Sparkles,
  UserRoundCheck,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

/* ------------------------------------------------------------------ */
/*  Reusable pieces                                                    */
/* ------------------------------------------------------------------ */

function TrackIcon({ name }: { name: "mentorship" | "research" }) {
  const cls = "h-5 w-5 text-[hsl(var(--primary))]";
  if (name === "mentorship") return <UserRoundCheck className={cls} aria-hidden="true" />;
  return <FlaskConical className={cls} aria-hidden="true" />;
}

/* #6 — pause-on-hover marquee */
function LogoMarquee({ logos, speedSeconds = 26 }: { logos: { name: string; src: string }[]; speedSeconds?: number }) {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-3xl border bg-card/40 px-8 py-7">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-[linear-gradient(to_right,hsl(var(--background)),transparent)]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-[linear-gradient(to_left,hsl(var(--background)),transparent)]" />

        {/* #7 — single column on mobile so logos have room */}
        <div className="grid items-center gap-6 md:gap-10 md:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="text-xs font-medium text-muted-foreground">
              Our students are accepted into
            </div>
            <div className="mt-1 font-serif text-3xl tracking-tight md:text-4xl">
              Programs you recognize.
            </div>
          </div>

          <div className="grid gap-2">
            <div className="group relative overflow-hidden">
              <div
                className="flex w-max items-center gap-3 group-hover:[animation-play-state:paused]"
                style={{ animation: `marquee ${speedSeconds}s linear infinite` } as React.CSSProperties}
              >
                {[...logos, ...logos].map((l, idx) => (
                  <div
                    key={`${l.name}-${idx}`}
                    className="flex items-center gap-2 rounded-2xl border bg-background/60 px-3.5 py-2.5 shadow-[0_10px_22px_hsl(var(--foreground)/0.06)]"
                  >
                    <div className="grid h-8 w-8 place-items-center rounded-xl border bg-card/60">
                      <img src={l.src} alt={l.name} className="h-6 w-6 object-contain opacity-90" />
                    </div>
                    <div className="text-xs font-medium text-foreground/80">
                      {l.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Results vary—our focus is rigorous preparation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* #12 — icons instead of abbreviations for mentorship "What we do" */
function WhatWeDoGrid() {
  const items = [
    {
      icon: <UserRoundCheck className="h-5 w-5 text-[hsl(var(--primary))]" />,
      title: "Elite mentor match",
      detail:
        "Matched to an admitted mentor aligned to interests and goals—first-hand guidance on positioning, project choice, and what top schools recognize.",
    },
    {
      icon: <Compass className="h-5 w-5 text-[hsl(var(--primary))]" />,
      title: "Throughline design",
      detail:
        "A coherent story unique to the student—academics and activities aligned into a multi-year narrative with depth and growth.",
    },
    {
      icon: <Hammer className="h-5 w-5 text-[hsl(var(--primary))]" />,
      title: "Project building",
      detail:
        "We help students build signature projects end-to-end—scope, milestones, execution, and outcomes that show initiative and original thinking.",
    },
    {
      icon: <Building2 className="h-5 w-5 text-[hsl(var(--primary))]" />,
      title: "Internship support",
      detail:
        "Identify realistic, profile-aligned roles, then guide outreach, applications, and preparation—prioritizing ownership and real work.",
    },
    {
      icon: <Calendar className="h-5 w-5 text-[hsl(var(--primary))]" />,
      title: "Summer building",
      detail:
        "Structure summers around projects, internships, and programs that strengthen the profile—never just filling space.",
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-[hsl(var(--primary))]" />,
      title: "Weekly accountability",
      detail:
        "Ongoing feedback to keep work sharp and authentic—no ghostwriting, ever.",
    },
  ] as const;

  return (
    <div className="mt-6">
      <div className="flex items-end justify-between gap-4">
        <div className="text-xs font-medium text-muted-foreground">What we do</div>
        <div className="hidden text-xs text-muted-foreground md:block">
          Ethical, student-led work only
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((x, wi) => (
          <div
            key={wi}
            className="rounded-2xl border bg-background/55 p-5 shadow-[0_10px_28px_hsl(var(--foreground)/0.05)]"
          >
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 flex-none place-items-center rounded-xl border bg-card/60" aria-hidden="true">
                {x.icon}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium leading-snug">{x.title}</div>
                <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{x.detail}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* #12 — icons for research "What we do" */
const researchWhatWeDo = [
  { icon: <UserRoundCheck className="h-5 w-5 text-[hsl(var(--primary))]" />, title: "Research mentor match", detail: "Matched with a top researcher in the student's field of interest—direct guidance on scope, methods, and how real scholars evaluate strong work." },
  { icon: <Search className="h-5 w-5 text-[hsl(var(--primary))]" />, title: "Question & scope design", detail: "We refine vague interests into precise, researchable questions—realistic scope, real ambition, and real originality." },
  { icon: <FlaskConical className="h-5 w-5 text-[hsl(var(--primary))]" />, title: "Methodology & execution", detail: "Learn and apply appropriate methods (theoretical, computational, experimental, qualitative) with rigor—assumptions, limitations, and clarity included." },
  { icon: <BookOpen className="h-5 w-5 text-[hsl(var(--primary))]" />, title: "Literature navigation", detail: "Read papers effectively, identify gaps, situate work in scholarship, and avoid shallow summaries or overclaims." },
  { icon: <PenLine className="h-5 w-5 text-[hsl(var(--primary))]" />, title: "Writing & revision", detail: "Structured drafting support for papers, reports, or preprints—argument, structure, and precision over fluff." },
  { icon: <Award className="h-5 w-5 text-[hsl(var(--primary))]" />, title: "Presentation & next steps", detail: "Prepare for fairs, journals, conferences, or independent submission—and understand what outcomes are realistic at the high school level." },
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Home() {
  const [selectedTrack, setSelectedTrack] = React.useState<"mentorship" | "research">("mentorship");
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  /* #2 — detect scroll for sticky header */
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const acceptedLogos = [
    { name: "Harvard", src: "/logos/harvard.webp" },
    { name: "MIT", src: "/logos/mit.png" },
    { name: "Penn", src: "/logos/penn.png" },
    { name: "Princeton", src: "/logos/princeton.png" },
    { name: "Stanford", src: "/logos/stanford.png" },
    { name: "Cornell", src: "/logos/cornell.png" },
  ];

  const navLinks = [
    { label: "Tracks", href: "#tracks" },
    { label: "Process", href: "#process" },
    { label: "Events", href: "https://luma.com/launchpadprep?period=past", external: true },
    { label: "Apply", href: "#consultation" },
  ];

  const tracks = [
    {
      key: "mentorship" as const,
      name: "Launchpad Profile Mentorship",
      duration: "6 months",
      price: "$3,000",
      meetingCount: "15 hours of 1-on-1 mentoring",
      tagline: "We help students intentionally craft an exceptional college profile — early, coherent, and backed by real work.",
      desc: "This program provides long-range guidance for students who want to shape a standout profile well before senior year. Each student is matched with an elite mentor who shares their academic interests and long-term goals — someone who has already been admitted to top colleges along the same path. Together, we define a clear profile throughline, then build credible proof through student-led projects, leadership, and meaningful experience. Everything is ethical, authentic, and grounded in real work.",
      bullets: [
        "Elite mentor match (by passion and goals)",
        "Profile positioning + throughline design",
        "Signature project building",
        "Internship strategy + support",
        "Strategic summer building",
        "Weekly guidance + accountability (no ghostwriting, ever)",
      ],
      examples: [
        {
          student: "Mira · Public Policy + Debate",
          built: [
            "Zoning-reform white paper modeling rent, density, and displacement impacts using census + planning data",
            "Stakeholder interview study (tenants, small landlords, city planners) synthesized into a policy tradeoff map",
            "Legislative explainer series translating active city council bills into plain-language briefs for first-time voters",
          ],
          workedAt: ["City council office — policy research intern", "Prepared constituent sentiment summaries + issue briefs for staff meetings"],
          outcome: "Admitted to a top school for Government / Public Policy",
          proof: ["White paper", "Interview transcripts", "Legislative brief archive"],
        },
        {
          student: "Rina · Biology + Public Health",
          built: [
            "Evidence-based teen mental health guide translating clinical research into plain-language recommendations (clinician-reviewed)",
            "Patient follow-up tracking tool pinpointing where referrals break down between intake and care",
            "Independent ethics paper analyzing consent, privacy, and harm in adolescent public-health interventions",
          ],
          workedAt: ["Community health clinic — outreach intern", "Assisted with patient education sessions + logistics"],
          outcome: "Admitted to a top school for Public Health / Global Affairs",
          proof: ["Health guide", "Tracking tool", "Ethics paper"],
        },
        {
          student: "Omar · Robotics + Environmental Advocacy",
          built: [
            "Low-cost river water-quality sensing robot measuring turbidity + temperature, field-tested at multiple local sites",
            "Autonomous litter-collection rover for school grounds with documented mechanical tradeoffs + obstacle-avoidance limits",
            "Technical policy brief on deploying autonomous environmental monitors in urban waterways (cost, maintenance, data ethics)",
          ],
          workedAt: ["Environmental nonprofit — technical volunteer", "Supported sensor maintenance + field data collection"],
          outcome: "Admitted to a top school for Engineering / Robotics",
          proof: ["Robot build", "Field test logs", "Policy brief"],
        },
      ],
    },
    {
      key: "research" as const,
      name: "Launchpad Research Lab",
      duration: "3 months",
      price: "$3,000",
      meetingCount: "12 weekly 1-on-1 mentoring sessions",
      tagline: "We help students conduct real, original research — early, rigorous, and guided by how scholarship actually works.",
      /* #10 — split into two paragraphs */
      descParts: [
        "This program is designed for students who want to move beyond surface-level \"research projects\" and learn how knowledge is genuinely produced. Each student is paired with a domain-aligned mentor and guided through the full research lifecycle: from question formation to methodology, execution, and presentation. The focus is depth, intellectual honesty, and work that holds up under real scrutiny — not résumé padding.",
        "Everything is student-driven, ethical, and grounded in authentic inquiry.",
      ],
      bullets: [
        "Research mentor match",
        "Question & scope design",
        "Methodology & execution",
        "Literature navigation",
        "Writing & revision",
        "Presentation & next steps",
      ],
      examples: [
        {
          student: "Leo · Economics",
          built: [
            "Constructed a panel dataset combining business registry data, transit expansion timelines, and census tract characteristics",
            "Implemented a difference-in-differences design comparing treated and control neighborhoods",
            "Conducted parallel-trends validation and placebo tests",
            "Quantified heterogeneous effects by business type and neighborhood income level",
          ],
          workedAt: [
            "First place, regional economics and policy research competition",
            "Oral presentation at a pre-college economics research conference",
            "Paper published in a student economics research journal",
          ],
          /* #14 — add outcome to research examples */
          outcome: "Published in a student economics research journal",
          proof: ["Panel dataset", "DiD design", "Placebo tests"],
        },
        {
          student: "Hana · Computer Science",
          built: [
            "Trained binary classifiers on controlled synthetic datasets with tunable class imbalance and group skew",
            "Measured instability of common fairness metrics as a function of sample size and noise",
            "Evaluated false confidence regions where metrics indicate fairness despite systematic error",
            "Documented risks through a formal model card and misuse analysis",
          ],
          workedAt: [
            "Regeneron ISEF qualifier in Computer Science",
            "Paper accepted to a student machine learning research conference",
            "Preprint published on an open-access research archive",
          ],
          outcome: "Regeneron ISEF qualifier in Computer Science",
          proof: ["Synthetic datasets", "Fairness metrics", "Model card"],
        },
        {
          student: "Diego · Psychology and Data",
          built: [
            "Designed a five-item impulsivity instrument grounded in existing psychological scales",
            "Collected longitudinal survey data with weekly behavioral follow-ups",
            "Compared predictive performance against baseline demographic and behavioral models",
            "Quantified attenuation bias and measurement error effects",
          ],
          workedAt: [
            "Top award at a state science and engineering fair",
            "Oral presentation at a psychology research symposium",
            "Manuscript under review at a student psychology journal",
          ],
          outcome: "Top award at a state science and engineering fair",
          proof: ["Survey instrument", "Longitudinal data", "Attenuation bias"],
        },
      ],
    },
  ];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <style>{`
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>

      {/* ============================================================ */}
      {/* #1 #2 #3 — Sticky header with nav links + mobile menu        */}
      {/* ============================================================ */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-background/80 backdrop-blur-lg border-b shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 md:px-8">
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Launchpad Prep" className="h-10 w-10 rounded-2xl object-contain" />
            <div className="font-serif text-lg leading-none">
              Launchpad Prep
            </div>
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              )
            )}
            <Button
              className="rounded-2xl"
              onClick={() => scrollTo("consultation")}
            >
              Book a free strategy session
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-xl border md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-b bg-background/95 backdrop-blur-lg md:hidden"
            >
              <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 pb-4">
                {navLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  )
                )}
                <Button
                  className="mt-2 rounded-2xl"
                  onClick={() => scrollTo("consultation")}
                >
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============================================================ */}
      {/*  Hero                                                         */}
      {/* ============================================================ */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-90">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[hsl(var(--accent))]/12 blur-3xl" />
          <div className="absolute -right-40 -top-32 h-[520px] w-[520px] rounded-full bg-[hsl(var(--primary))]/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,hsl(var(--foreground)/0.05),transparent_45%),radial-gradient(circle_at_80%_10%,hsl(var(--foreground)/0.04),transparent_38%)]" />
        </div>

        <main className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-6 md:px-8 md:pb-24 md:pt-10">
          <motion.div variants={container} initial="hidden" animate="show">
            <motion.div variants={item} className="flex flex-col items-start gap-4">
              <h1 className="text-balance font-serif text-4xl leading-[1.05] tracking-[-0.03em] md:text-6xl">
                Build standout student profiles with{" "}
                <span className="relative whitespace-nowrap">
                  <span className="relative z-10">expert mentorship</span>
                  <span className="absolute -inset-x-2 bottom-0 top-1 rounded-3xl bg-[hsl(var(--accent))]/15" aria-hidden="true" />
                </span>
                .
              </h1>

              <div className="max-w-2xl text-base text-muted-foreground md:text-lg">
                <p className="mb-4 text-foreground/80 font-medium">Work with a mentor who fits your passions, interests, and goals to:</p>
                {/* #4 — checkmarks instead of arrow icons */}
                <div className="flex flex-col gap-2">
                  {[
                    "Become a published researcher",
                    "Build a standout passion project",
                    "Win national awards",
                    "Stand out in college applications",
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-[hsl(var(--primary))]" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  className="rounded-2xl"
                  size="lg"
                  onClick={() => scrollTo("consultation")}
                >
                  Get matched
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className="rounded-2xl"
                  onClick={() => scrollTo("tracks")}
                >
                  Explore tracks
                </Button>
              </div>

              <LogoMarquee logos={acceptedLogos} speedSeconds={26} />
            </motion.div>
          </motion.div>

          {/* ======================================================== */}
          {/* #8 — Philosophy section with CTA                          */}
          {/* #25 — section divider via top margin + border card        */}
          {/* ======================================================== */}
          <section className="mt-16 md:mt-24">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl border bg-gradient-to-b from-card/60 to-background p-8 text-center shadow-soft md:p-12">
              <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute -left-10 -top-10 h-64 w-64 rounded-full bg-[hsl(var(--accent))]/10 blur-3xl" />
                <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-[hsl(var(--primary))]/10 blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))] shadow-sm">
                  <UserRoundCheck className="h-7 w-7" />
                </div>

                <h2 className="mx-auto max-w-2xl font-serif text-3xl tracking-tight md:text-4xl">
                  Match with a mentor who has achieved your dream.
                </h2>

                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                  We want to provide you with the clearest possible pathway to achieving your dreams, so we work hard to match you with a mentor who has achieved them. Work with a mentor who was accepted into your dream program at your dream school and build a profile that is undeniable.
                </p>

                <Button
                  className="mt-6 rounded-2xl"
                  size="lg"
                  onClick={() => scrollTo("consultation")}
                >
                  Get matched
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* #25 — subtle divider between sections                     */}
          {/* ======================================================== */}
          <Separator className="mx-auto mt-16 max-w-xs opacity-30 md:mt-24" />

          {/* ======================================================== */}
          {/*  Tracks section                                           */}
          {/* ======================================================== */}
          <section id="tracks" className="mt-16 md:mt-24">
            <div className="flex flex-col items-center justify-between gap-6 text-center">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Tracks</div>
                <h2 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">
                  Choose your Launchpad track.
                </h2>
              </div>

              <div className="w-full max-w-[620px]">
                <div
                  className="glass flex w-full items-center justify-between gap-1 rounded-2xl border bg-card/60 p-1 shadow-soft"
                  role="tablist"
                  aria-label="Choose a track"
                >
                  {(
                    [
                      { key: "mentorship", label: "Profile Mentorship", meta: "Grades 7–11" },
                      { key: "research", label: "Research Lab", meta: "12 weeks" },
                    ] as const
                  ).map((opt) => {
                    const isActive = opt.key === selectedTrack;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setSelectedTrack(opt.key)}
                        className={`group relative flex-1 rounded-xl px-4 py-3 text-left transition-all duration-300 ${
                          isActive
                            ? "bg-background shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)] ring-1 ring-black/5 z-10 scale-[1.02]"
                            : "hover:bg-background/50 opacity-60 hover:opacity-100"
                        }`}
                        role="tab"
                        aria-selected={isActive}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className={`truncate text-sm font-medium ${isActive ? "text-foreground" : "text-foreground/80"}`}>
                              {opt.label}
                            </div>
                            <div className="mt-0.5 text-xs text-muted-foreground">{opt.meta}</div>
                          </div>
                          <div
                            className={`grid h-9 w-9 place-items-center rounded-xl border transition-colors ${
                              isActive
                                ? "border-[hsl(var(--primary))]/30 bg-[hsl(var(--primary))]/5 text-[hsl(var(--primary))]"
                                : "border-transparent bg-transparent text-muted-foreground group-hover:bg-background/60"
                            }`}
                          >
                            <TrackIcon name={opt.key} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Pick one track to see details, sample outcomes, and what's included.
                </div>
              </div>
            </div>

            {/* #9 — animate track switching */}
            <div className="mt-8">
              <AnimatePresence mode="wait">
                {tracks
                  .filter((t) => t.key === selectedTrack)
                  .map((t) => (
                    <motion.div
                      key={t.key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="glass relative overflow-hidden rounded-3xl p-7 shadow-soft md:p-8">
                        <div className="pointer-events-none absolute inset-0 opacity-80">
                          <div className="absolute -left-28 -top-28 h-72 w-72 rounded-full bg-[hsl(var(--accent))]/10 blur-3xl" />
                          <div className="absolute -bottom-28 -right-28 h-72 w-72 rounded-full bg-[hsl(var(--primary))]/12 blur-3xl" />
                        </div>

                        <div className="relative grid gap-7">
                          <div>
                            {/* #11 — price badge wraps on small screens */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div className="inline-flex items-center gap-2">
                                <div className="rounded-2xl border bg-background/60 p-2.5">
                                  <TrackIcon name={t.key} />
                                </div>
                                <div className="font-medium text-lg">
                                  {t.name} <span className="text-muted-foreground font-normal text-base">({t.duration})</span>
                                </div>
                              </div>
                              <div className="shrink-0 self-start rounded-full bg-[hsl(var(--accent))] px-4 py-1.5 text-sm font-bold text-white shadow-sm">
                                {t.price}
                              </div>
                            </div>

                            <div className="mt-3 text-sm text-muted-foreground">{t.tagline}</div>

                            {/* #10 — split description into paragraphs */}
                            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                              {"descParts" in t ? (
                                (t as any).descParts.map((p: string, pi: number) => <p key={pi}>{p}</p>)
                              ) : (
                                <p>{"desc" in t ? (t as any).desc : ""}</p>
                              )}
                            </div>

                            {t.meetingCount && (
                              <div className="mt-5 flex items-center gap-2 text-sm font-medium text-[hsl(var(--accent))]">
                                <Check className="h-4 w-4" />
                                {t.meetingCount}
                              </div>
                            )}

                            {t.key === "mentorship" ? (
                              <WhatWeDoGrid />
                            ) : (
                              <div className="mt-6">
                                <div className="flex items-end justify-between gap-4">
                                  <div className="text-xs font-medium text-muted-foreground">What we do</div>
                                  <div className="hidden text-xs text-muted-foreground md:block">
                                    Ethical, original research only
                                  </div>
                                </div>

                                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                  {researchWhatWeDo.map((x, wi) => (
                                    <div
                                      key={wi}
                                      className="rounded-2xl border bg-background/55 p-5 shadow-[0_10px_28px_hsl(var(--foreground)/0.05)]"
                                    >
                                      <div className="flex items-start gap-3">
                                        <div className="grid h-10 w-10 flex-none place-items-center rounded-xl border bg-card/60" aria-hidden="true">
                                          {x.icon}
                                        </div>
                                        <div className="min-w-0">
                                          <div className="text-sm font-medium leading-snug">{x.title}</div>
                                          <div className="mt-2 text-xs leading-relaxed text-muted-foreground">{x.detail}</div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="mt-7 flex flex-wrap gap-3">
                              <Button size="lg" className="rounded-2xl" onClick={() => scrollTo("consultation")}>
                                Request a consultation
                                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                              </Button>
                              <Button variant="secondary" size="lg" className="rounded-2xl" onClick={() => scrollTo("process")}>
                                See our process
                              </Button>
                            </div>
                          </div>

                          {/* Example outcomes */}
                          <div>
                            <div className="rounded-3xl border bg-background/45 p-5">
                              <div className="flex flex-col items-start justify-between gap-1 sm:flex-row sm:items-end sm:gap-4">
                                <div>
                                  <div className="text-xs font-medium text-muted-foreground">Example outcomes</div>
                                  <div className="mt-1 text-sm text-foreground/80">What "proof" looks like in practice.</div>
                                </div>
                              </div>

                              <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {t.examples.map((ex, idx) => (
                                  <div
                                    key={idx}
                                    className="group flex flex-col overflow-hidden rounded-2xl border bg-card/60 p-5 shadow-[0_10px_28px_hsl(var(--foreground)/0.04)] transition hover:bg-card/70 hover:shadow-[0_12px_32px_hsl(var(--foreground)/0.06)]"
                                  >
                                    <div className="mb-4">
                                      <div className="flex items-start justify-between gap-4">
                                        <div>
                                          <div className="text-lg font-semibold leading-tight text-foreground">
                                            {ex.student.split(" · ")[0]}
                                          </div>
                                          <div className="text-sm font-medium text-muted-foreground">
                                            {ex.student.split(" · ")[1]}
                                          </div>
                                        </div>
                                        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[hsl(var(--accent))]/10 text-[hsl(var(--accent))]">
                                          {t.key === "research" ? <FlaskConical className="h-5 w-5" /> : <UserRoundCheck className="h-5 w-5" />}
                                        </div>
                                      </div>
                                    </div>

                                    <Separator className="mb-4 opacity-50" />

                                    <div className="flex flex-1 flex-col gap-5">
                                      <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                          <Sparkles className="h-3 w-3 text-[hsl(var(--accent))]" />
                                          {t.key === "research" ? "What the research did" : "Built"}
                                        </div>
                                        <div className="rounded-xl bg-background/50 p-3 text-sm leading-relaxed text-foreground/90">
                                          <ul className="space-y-2">
                                            {ex.built.map((line, li) => (
                                              <li key={li} className="flex gap-2.5">
                                                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[hsl(var(--accent))]" />
                                                <span>{line}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>

                                      <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                          <Briefcase className="h-3 w-3 text-[hsl(var(--accent))]" />
                                          {t.key === "research" ? "External outcomes" : "Worked at"}
                                        </div>
                                        <div className="rounded-xl bg-background/50 p-3 text-sm leading-relaxed text-foreground/90">
                                          <ul className="space-y-2">
                                            {ex.workedAt.map((line, li) => (
                                              <li key={li} className="flex gap-2.5">
                                                <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[hsl(var(--accent))]" />
                                                <span>{line}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>

                                      {ex.outcome && (
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                            <GraduationCap className="h-3 w-3 text-[hsl(var(--accent))]" />
                                            Outcome
                                          </div>
                                          <div className="rounded-xl border border-[hsl(var(--accent))]/20 bg-[hsl(var(--accent))]/5 p-3 text-sm font-medium text-foreground">
                                            {ex.outcome}
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* #15 — label above proof tags */}
                                    <div className="mt-5">
                                      <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                        Key deliverables
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {ex.proof.map((h, hi) => (
                                          <div
                                            key={hi}
                                            className="inline-flex items-center rounded-md border bg-background px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm transition hover:text-foreground"
                                          >
                                            {h}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </section>

          {/* #25 — divider */}
          <Separator className="mx-auto mt-16 max-w-xs opacity-30 md:mt-24" />

          {/* ======================================================== */}
          {/* #16 #17 — Process with connecting lines + CTA             */}
          {/* ======================================================== */}
          <section id="process" className="mt-16 md:mt-24">
            <div className="flex flex-col items-center justify-between gap-6 text-center">
              <div>
                <div className="text-xs font-medium text-muted-foreground">How It Works</div>
                <h2 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">
                  Getting started is easy.
                </h2>
                <p className="mt-3 max-w-xl text-balance text-sm text-muted-foreground">
                  Here's what to expect every step of the way.
                </p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { t: "Submit Your Application", d: "Tell us about your interests, goals, and aspirations. It only takes a few minutes to get started.", step: 1 },
                { t: "Free Strategy Session", d: "Receive a complimentary 20-minute strategy session with your best-fit mentor—no commitment required.", step: 2 },
                { t: "View Your Blueprint", d: "Get a personalized admissions blueprint outlining your path to success and recommended next steps.", step: 3 },
                { t: "Book Your Mentor", d: "Ready to go? Lock in your mentor and begin your journey toward standout applications and real accomplishments.", step: 4 },
              ].map((x, idx) => (
                <div key={idx} className="group relative flex flex-col items-center text-center p-4">
                  {/* #16 — connecting line between steps */}
                  {idx < 3 && (
                    <div className="pointer-events-none absolute left-[calc(50%+1.5rem)] top-6 hidden h-[2px] w-[calc(100%-3rem)] bg-gradient-to-r from-[hsl(var(--primary))]/40 to-[hsl(var(--primary))]/10 lg:block" />
                  )}
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary))] text-lg font-bold text-primary-foreground shadow-lg transition-transform duration-300 group-hover:scale-110">
                    {x.step}
                  </div>
                  <div className="mt-4 font-medium">{x.t}</div>
                  <div className="mt-2 text-sm text-muted-foreground leading-relaxed">{x.d}</div>
                </div>
              ))}
            </div>

            {/* #17 — CTA after process */}
            <div className="mt-10 flex justify-center">
              <Button size="lg" className="rounded-2xl" onClick={() => scrollTo("consultation")}>
                Start your application
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </section>

          {/* #25 — divider */}
          <Separator className="mx-auto mt-16 max-w-xs opacity-30 md:mt-24" />

          {/* ======================================================== */}
          {/* #18 #19 #20 — Consultation / Typeform                     */}
          {/* ======================================================== */}
          <section id="consultation" className="mt-16 md:mt-24">
            <Card className="glass overflow-hidden rounded-3xl p-7 shadow-soft md:p-10">
              <div className="grid gap-6 md:grid-cols-12">
                <div className="md:col-span-5">
                  <div className="text-xs font-medium text-muted-foreground">Free consultation</div>
                  <h2 className="mt-2 font-serif text-3xl tracking-tight md:text-4xl">
                    Get matched to the right track.
                  </h2>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Tell us the student's grade, interests, and goals. We'll recommend a track and next steps.
                  </p>
                  <p className="mt-4 text-xs text-muted-foreground">
                    We respond within 1–2 business days.
                  </p>

                  {/* #26 — contact info */}
                  <div className="mt-6 space-y-2 border-t pt-4">
                    <div className="text-xs font-medium text-muted-foreground">Questions? Reach out anytime:</div>
                    <a href="mailto:hello@launchpadprep.com" className="block text-sm text-foreground/80 hover:text-foreground transition-colors">
                      hello@launchpadprep.com
                    </a>
                  </div>
                </div>

                <div className="md:col-span-7">
                  {/* #19 — loading background while iframe loads */}
                  <div className="relative w-full rounded-2xl bg-muted/30">
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
                      Loading form...
                    </div>
                    {/* #18 — responsive height */}
                    <iframe
                      src="https://form.typeform.com/to/yu0gXekQ"
                      title="Launchpad Prep Application"
                      className="relative z-10 w-full rounded-2xl border-0"
                      style={{ height: "clamp(400px, 60vh, 600px)" }}
                      allow="camera; microphone; autoplay; encrypted-media;"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* ======================================================== */}
          {/* #21 #22 #26 #27 — Enhanced footer                        */}
          {/* ======================================================== */}
          <footer className="mt-16 border-t pt-10 pb-8 text-sm text-muted-foreground">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Brand */}
              <div>
                <a href="/" className="flex items-center gap-2">
                  <img src="/logo.png" alt="Launchpad Prep" className="h-8 w-8 rounded-xl object-contain" />
                  <span className="font-serif text-base text-foreground">Launchpad Prep</span>
                </a>
                <p className="mt-2 text-xs leading-relaxed">
                  Empowering the next generation of scholars through personalized mentorship.
                </p>
              </div>

              {/* Quick links */}
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/60">Quick Links</div>
                <div className="flex flex-col gap-1.5">
                  <a href="#tracks" className="hover:text-foreground transition-colors">Tracks</a>
                  <a href="#process" className="hover:text-foreground transition-colors">Process</a>
                  <a href="#consultation" className="hover:text-foreground transition-colors">Apply</a>
                  <a href="https://luma.com/launchpadprep?period=past" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    Events
                  </a>
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-foreground/60">Contact</div>
                <div className="flex flex-col gap-1.5">
                  <a href="mailto:hello@launchpadprep.com" className="hover:text-foreground transition-colors">hello@launchpadprep.com</a>
                </div>

                <div className="mt-4 text-xs text-muted-foreground/70">
                  Our mentors come from: Stanford, Harvard, MIT, Yale, Princeton, Columbia, UPenn, Duke
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 md:flex-row">
              <div>&copy; {new Date().getFullYear()} Launchpad Prep. All rights reserved.</div>

              {/* #22 — back to top */}
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Back to top
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
