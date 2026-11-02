import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Trash2, Inbox } from "lucide-react";
import { toast } from "sonner";
import { statuses, useApplications, type AppStatus } from "@/lib/store";
import { PageHeader } from "@/components/site/Shell";
import { CompanyBadge } from "@/components/site/JobCard";

export const Route = createFileRoute("/applications")({
  head: () => ({
    meta: [
      { title: "Application Tracker – DevPortal" },
      { name: "description", content: "Track your job applications: Applied, Under Review, Interview Scheduled, Selected, Rejected." },
      { property: "og:title", content: "Application Tracker – DevPortal" },
      { property: "og:description", content: "Track every job application by status in one dashboard." },
    ],
  }),
  component: Applications,
});

export const statusStyle: Record<AppStatus, string> = {
  Applied: "bg-info-soft text-info",
  "Under Review": "bg-warning-soft text-warning",
  "Interview Scheduled": "bg-accent text-violet",
  Selected: "bg-success-soft text-success",
  Rejected: "bg-destructive-soft text-destructive",
};

function Applications() {
  const { apps, setStatus, remove } = useApplications();
  const [filter, setFilter] = useState<AppStatus | "All">("All");
  const shown = filter === "All" ? apps : apps.filter((a) => a.status === filter);

  return (
    <>
      <PageHeader title="Application Tracker" subtitle="Follow each application through every stage. Update statuses to simulate recruiter progress for your demo." />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {statuses.map((s) => (
            <button key={s} onClick={() => setFilter(filter === s ? "All" : s)} className={`card-surface card-hover p-4 text-left ${filter === s ? "ring-2 ring-violet" : ""}`}>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusStyle[s]}`}>{s}</span>
              <p className="mt-3 font-display text-3xl font-bold">{apps.filter((a) => a.status === s).length}</p>
            </button>
          ))}
        </div>

        <div className="mt-8 card-surface overflow-hidden">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="font-semibold">{filter === "All" ? "All applications" : filter} <span className="text-muted-foreground">({shown.length})</span></h2>
            {filter !== "All" && <button onClick={() => setFilter("All")} className="text-sm font-semibold text-violet">Show all</button>}
          </div>
          {shown.length === 0 ? (
            <div className="flex flex-col items-center p-14 text-center">
              <Inbox className="size-10 text-muted-foreground" />
              <p className="mt-3 font-semibold">No applications yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Apply to a job and it will appear here.</p>
              <Link to="/jobs" className="mt-4 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-primary-foreground">Explore jobs</Link>
            </div>
          ) : (
            <ul className="divide-y">
              {shown.map((a) => (
                <li key={a.id} className="flex flex-col gap-4 p-5 transition hover:bg-muted/50 md:flex-row md:items-center">
                  <CompanyBadge name={a.company} />
                  <div className="flex-1">
                    <Link to="/jobs/$id" params={{ id: a.jobId }} className="font-semibold hover:text-violet">{a.jobTitle}</Link>
                    <p className="text-sm text-muted-foreground">{a.company} · Applied {new Date(a.appliedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><FileText className="size-3.5" />{a.resumeName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={a.status} onChange={(e) => { setStatus(a.id, e.target.value as AppStatus); toast.success(`Status updated to ${e.target.value}`); }}
                      className={`rounded-full border-0 px-3 py-1.5 text-sm font-semibold outline-none ${statusStyle[a.status]}`} aria-label="Application status">
                      {statuses.map((s) => <option key={s}>{s}</option>)}
                    </select>
                    <button onClick={() => { remove(a.id); toast("Application withdrawn"); }} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive-soft hover:text-destructive" aria-label="Withdraw"><Trash2 className="size-4" /></button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
