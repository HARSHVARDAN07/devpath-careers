import { Link } from "@tanstack/react-router";
import { MapPin, Briefcase, IndianRupee, Clock } from "lucide-react";
import type { Job } from "@/data/jobs";

export function CompanyBadge({ name, size = 44 }: { name: string; size?: number }) {
  return (
    <span style={{ width: size, height: size }} className="grid shrink-0 place-items-center rounded-xl bg-accent font-display font-bold text-accent-foreground">
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function ModeBadge({ mode }: { mode: Job["mode"] }) {
  const cls = mode === "Remote" ? "bg-success-soft text-success" : mode === "Hybrid" ? "bg-info-soft text-info" : "bg-warning-soft text-warning";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{mode}</span>;
}

export function JobCard({ job }: { job: Job }) {
  return (
    <article className="card-surface card-hover flex flex-col p-5">
      <div className="flex items-start gap-3">
        <CompanyBadge name={job.company} />
        <div className="min-w-0 flex-1">
          <Link to="/jobs/$id" params={{ id: job.id }} className="font-display font-semibold leading-tight hover:text-violet">{job.title}</Link>
          <p className="text-sm text-muted-foreground">{job.company}</p>
        </div>
        <ModeBadge mode={job.mode} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5"><MapPin className="size-4" />{job.location}</span>
        <span className="flex items-center gap-1.5"><Briefcase className="size-4" />{job.experience}</span>
        <span className="flex items-center gap-1.5 font-medium text-foreground"><IndianRupee className="size-4" />{job.salary.replace("₹", "")}</span>
        <span className="flex items-center gap-1.5"><Clock className="size-4" />{job.type}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.skills.map((s) => <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">{s}</span>)}
      </div>
      <div className="mt-5 flex items-center justify-between border-t pt-4">
        <span className="text-xs text-muted-foreground">{job.posted} · Sample listing</span>
        <Link to="/jobs/$id" params={{ id: job.id }} hash="apply" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">Apply Now</Link>
      </div>
    </article>
  );
}
