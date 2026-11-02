import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Users, Code2, GraduationCap } from "lucide-react";
import { PageHeader } from "@/components/site/Shell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About DevPortal – Engineering Job Portal" },
      { name: "description", content: "DevPortal is a job portal focused on software developers, freshers and IT professionals." },
      { property: "og:title", content: "About DevPortal" },
      { property: "og:description", content: "A job portal focused on software developers, freshers and IT professionals." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <PageHeader title="About DevPortal" subtitle="A focused job portal for the engineering community — from first-job freshers to senior architects." />
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { i: Target, t: "Our mission", d: "Make engineering job search faster by organising roles around real technologies and skills." },
            { i: Users, t: "Who it's for", d: "Software developers, freshers, experienced engineers and IT professionals across India." },
            { i: Code2, t: "Built with", d: "React, TypeScript, Tailwind CSS and reusable components, with a responsive SaaS-style UI." },
            { i: GraduationCap, t: "Project note", d: "Built as a final-year engineering project. All job listings are sample data, not verified real vacancies." },
          ].map(({ i: I, t, d }) => (
            <div key={t} className="card-surface card-hover p-6">
              <span className="grid size-11 place-items-center rounded-xl bg-accent text-violet"><I className="size-5" /></span>
              <h2 className="mt-4 text-lg font-semibold">{t}</h2>
              <p className="mt-1 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center"><Link to="/jobs" className="rounded-lg bg-brand px-6 py-3 text-sm font-semibold text-primary-foreground">Start exploring jobs</Link></div>
      </div>
    </>
  );
}
