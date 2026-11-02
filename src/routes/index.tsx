import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, MapPin, Server, Layout, Cloud, Brain, Smartphone, Bug, ShieldCheck, Zap, LineChart, FileText, ArrowRight, Sparkles } from "lucide-react";
import { categories, companies, trendingTags, type CategoryId } from "@/data/jobs";
import { useJobs } from "@/lib/store";
import { JobCard } from "@/components/site/JobCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DevPortal – Find Your Next Engineering Role" },
      { name: "description", content: "Search developer jobs by technology and location. Track applications from Applied to Selected." },
      { property: "og:title", content: "DevPortal – Find Your Next Engineering Role" },
      { property: "og:description", content: "Search developer jobs by technology and location. Track applications from Applied to Selected." },
    ],
  }),
  component: Home,
});

export const catIcons: Record<CategoryId, typeof Server> = { backend: Server, frontend: Layout, cloud: Cloud, data: Brain, mobile: Smartphone, qa: Bug };

function Home() {
  const nav = useNavigate();
  const { jobs } = useJobs();
  const [q, setQ] = useState("");
  const [loc, setLoc] = useState("");
  const counts = (c: CategoryId) => jobs.filter((j) => j.category === c).length;

  return (
    <>
      <section className="bg-hero relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.2fr_1fr]">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-semibold text-violet shadow-card">
              <Sparkles className="size-3.5" /> Built for developers, freshers & IT pros
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Find Your Next <span className="text-brand">Engineering Role</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground">Search roles by technology and city, apply with your resume, and track every application in one dashboard.</p>
            <form onSubmit={(e) => { e.preventDefault(); nav({ to: "/jobs", search: { q: q.trim() || undefined, location: loc.trim() || undefined } }); }}
              className="card-surface mt-8 flex flex-col gap-2 p-2 shadow-lift sm:flex-row">
              <label className="flex flex-1 items-center gap-2 px-3"><Search className="size-5 text-muted-foreground" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Job title or technology" className="w-full bg-transparent py-3 text-sm outline-none" aria-label="Job title or technology" /></label>
              <label className="flex flex-1 items-center gap-2 border-t px-3 sm:border-l sm:border-t-0"><MapPin className="size-5 text-muted-foreground" />
                <input value={loc} onChange={(e) => setLoc(e.target.value)} placeholder="City or Remote" className="w-full bg-transparent py-3 text-sm outline-none" aria-label="Location" /></label>
              <button className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Search jobs</button>
            </form>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Trending:</span>
              {trendingTags.map((t) => (
                <Link key={t} to="/jobs" search={{ q: t }} className="rounded-full border bg-background px-3 py-1 text-sm font-medium transition hover:border-violet hover:text-violet">{t}</Link>
              ))}
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 rounded-[2rem] bg-brand opacity-10 blur-2xl" />
            <div className="relative space-y-4">
              {jobs.slice(0, 3).map((j, i) => (
                <div key={j.id} className="card-surface animate-float flex items-center gap-3 p-4" style={{ animationDelay: `${i * 0.8}s`, marginLeft: i === 1 ? 48 : 0 }}>
                  <span className="grid size-11 place-items-center rounded-xl bg-accent font-display font-bold text-accent-foreground">{j.company.slice(0, 2).toUpperCase()}</span>
                  <div className="flex-1"><p className="font-semibold">{j.title}</p><p className="text-sm text-muted-foreground">{j.company} · {j.salary}</p></div>
                </div>
              ))}
              <div className="card-surface ml-20 flex items-center gap-3 p-4">
                <span className="grid size-11 place-items-center rounded-xl bg-success-soft text-success"><ShieldCheck /></span>
                <div><p className="font-semibold">Interview Scheduled</p><p className="text-sm text-muted-foreground">Track every stage live</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 py-8 sm:px-6">
          <span className="text-sm font-medium text-muted-foreground">Popular hiring companies</span>
          {companies.map((c) => (
            <Link key={c} to="/jobs" search={{ q: c }} className="font-display text-xl font-bold text-muted-foreground/70 transition hover:text-primary">{c}</Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHead eyebrow="Specializations" title="Browse by technical category" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => {
            const Icon = catIcons[c.id];
            return (
              <Link key={c.id} to="/jobs" search={{ category: c.id }} className="card-surface card-hover group flex items-center gap-4 p-5">
                <span className="grid size-12 place-items-center rounded-xl bg-accent text-violet transition group-hover:bg-brand group-hover:text-primary-foreground"><Icon /></span>
                <div className="flex-1"><h3 className="font-semibold">{c.name}</h3><p className="text-sm text-muted-foreground">{c.blurb}</p></div>
                <span className="text-sm font-semibold text-violet">{counts(c.id)}</span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <SectionHead eyebrow="Fresh openings" title="Recent job openings" left />
          <Link to="/jobs" className="hidden items-center gap-1 text-sm font-semibold text-violet hover:underline sm:flex">View all <ArrowRight className="size-4" /></Link>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">All listings are sample data for demonstration and are not verified real vacancies.</p>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {jobs.slice(0, 6).map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHead eyebrow="Why DevPortal" title="Made for how engineers job-hunt" />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { i: Zap, t: "Tech-first search", d: "Search by stack — Spring Boot, React, AWS — not vague titles." },
            { i: LineChart, t: "Application tracker", d: "See every application move from Applied to Selected." },
            { i: FileText, t: "Resume upload", d: "Attach your PDF resume once per application in seconds." },
            { i: ShieldCheck, t: "Transparent pay", d: "Salary ranges in INR shown upfront on every listing." },
          ].map(({ i: I, t, d }) => (
            <div key={t} className="card-surface card-hover p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-brand text-primary-foreground"><I className="size-5" /></span>
              <h3 className="mt-4 font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-16 overflow-hidden rounded-3xl bg-brand p-10 text-primary-foreground shadow-lift md:flex md:items-center md:justify-between">
          <div><h2 className="text-2xl font-bold sm:text-3xl">Hiring engineers?</h2><p className="mt-2 opacity-80">Post a role and reach developers in minutes.</p></div>
          <Link to="/post-job" className="mt-6 inline-flex rounded-lg bg-background px-6 py-3 text-sm font-semibold text-primary transition hover:opacity-90 md:mt-0">Post a Job</Link>
        </div>
      </section>
    </>
  );
}

export function SectionHead({ eyebrow, title, left }: { eyebrow: string; title: string; left?: boolean }) {
  return (
    <div className={left ? "" : "text-center"}>
      <p className="text-sm font-semibold uppercase tracking-wider text-violet">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold">{title}</h2>
    </div>
  );
}
