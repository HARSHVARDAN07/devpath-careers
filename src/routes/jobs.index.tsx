import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react";
import { categories, type CategoryId } from "@/data/jobs";
import { useJobs } from "@/lib/store";
import { JobCard } from "@/components/site/JobCard";
import { PageHeader } from "@/components/site/Shell";

const searchSchema = z.object({
  q: z.string().optional(),
  location: z.string().optional(),
  category: z.enum(["backend", "frontend", "cloud", "data", "mobile", "qa"]).optional(),
  mode: z.enum(["Remote", "Hybrid", "Onsite"]).optional(),
});

export const Route = createFileRoute("/jobs/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Explore Engineering Jobs – DevPortal" },
      { name: "description", content: "Filter developer jobs by technology, location, category and remote, hybrid or onsite." },
      { property: "og:title", content: "Explore Engineering Jobs – DevPortal" },
      { property: "og:description", content: "Filter developer jobs by technology, location, category and work mode." },
    ],
  }),
  component: Jobs,
});

function Jobs() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/jobs/" });
  const { jobs } = useJobs();
  const set = (patch: Partial<typeof s>) => navigate({ search: (p) => ({ ...p, ...patch }), replace: true });

  const q = (s.q ?? "").toLowerCase().trim();
  const l = (s.location ?? "").toLowerCase().trim();
  const filtered = jobs.filter((j) =>
    (!q || [j.title, j.company, ...j.skills].some((x) => x.toLowerCase().includes(q))) &&
    (!l || j.location.toLowerCase().includes(l) || (l === "remote" && j.mode === "Remote")) &&
    (!s.category || j.category === s.category) &&
    (!s.mode || j.mode === s.mode));
  const active = s.q || s.location || s.category || s.mode;

  return (
    <>
      <PageHeader title="Explore Jobs" subtitle="Sample listings for demonstration — not verified real vacancies.">
        <div className="card-surface mt-6 flex flex-col gap-2 p-2 sm:flex-row">
          <label className="flex flex-1 items-center gap-2 px-3"><Search className="size-5 text-muted-foreground" />
            <input value={s.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="Title, skill or company" className="w-full bg-transparent py-3 text-sm outline-none" aria-label="Search" /></label>
          <label className="flex flex-1 items-center gap-2 border-t px-3 sm:border-l sm:border-t-0"><MapPin className="size-5 text-muted-foreground" />
            <input value={s.location ?? ""} onChange={(e) => set({ location: e.target.value || undefined })} placeholder="Location" className="w-full bg-transparent py-3 text-sm outline-none" aria-label="Location" /></label>
        </div>
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-semibold"><SlidersHorizontal className="size-4" /> Filters</h2>
            {active && <button onClick={() => navigate({ search: {}, replace: true })} className="flex items-center gap-1 text-xs font-semibold text-violet"><X className="size-3" />Clear</button>}
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Work mode</p>
            <div className="flex flex-wrap gap-2">
              {(["Remote", "Hybrid", "Onsite"] as const).map((m) => (
                <button key={m} onClick={() => set({ mode: s.mode === m ? undefined : m })}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${s.mode === m ? "border-violet bg-accent text-violet" : "hover:bg-muted"}`}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</p>
            <div className="flex flex-col gap-1">
              {categories.map((c) => (
                <button key={c.id} onClick={() => set({ category: s.category === c.id ? undefined : (c.id as CategoryId) })}
                  className={`rounded-lg px-3 py-2 text-left text-sm transition ${s.category === c.id ? "bg-accent font-semibold text-violet" : "hover:bg-muted"}`}>{c.name}</button>
              ))}
            </div>
          </div>
        </aside>
        <section>
          <p className="mb-4 text-sm text-muted-foreground"><span className="font-semibold text-foreground">{filtered.length}</span> jobs found</p>
          {filtered.length ? (
            <div className="grid gap-5 md:grid-cols-2">{filtered.map((j) => <JobCard key={j.id} job={j} />)}</div>
          ) : (
            <div className="card-surface p-12 text-center">
              <p className="font-semibold">No jobs match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different technology, location, or clear filters.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
