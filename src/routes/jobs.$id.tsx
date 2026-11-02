import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Briefcase, IndianRupee, Clock, Upload, FileCheck2, CheckCircle2 } from "lucide-react";
import { categories } from "@/data/jobs";
import { useApplications, useJobs, useUser } from "@/lib/store";
import { CompanyBadge, ModeBadge } from "@/components/site/JobCard";
import { Btn, FieldError } from "@/components/site/Shell";

export const Route = createFileRoute("/jobs/$id")({
  head: () => ({
    meta: [
      { title: "Job Details – DevPortal" },
      { name: "description", content: "Role details, required skills, salary in INR and one-click apply with resume upload." },
      { property: "og:title", content: "Job Details – DevPortal" },
      { property: "og:description", content: "Role details, required skills, salary and apply with resume upload." },
    ],
  }),
  component: JobDetail,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  coverNote: z.string().trim().max(1000, "Keep it under 1000 characters"),
});

function JobDetail() {
  const { id } = Route.useParams();
  const { jobs } = useJobs();
  const job = jobs.find((j) => j.id === id);
  const { apps, add } = useApplications();
  const { user } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", coverNote: "" });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email })); }, [user]);

  if (!job) {
    return <div className="mx-auto max-w-xl px-4 py-24 text-center"><h1 className="text-2xl font-bold">Job not found</h1>
      <Link to="/jobs" className="mt-4 inline-block font-semibold text-violet">Back to jobs</Link></div>;
  }
  const already = apps.some((a) => a.jobId === job.id);

  const onFile = (f?: File) => {
    if (!f) return;
    const ok = /\.(pdf|docx?)$/i.test(f.name);
    if (!ok) return setErrors((e) => ({ ...e, resume: "Upload a PDF or Word document" }));
    if (f.size > 5 * 1024 * 1024) return setErrors((e) => ({ ...e, resume: "File must be smaller than 5 MB" }));
    setErrors((e) => { const { resume: _r, ...rest } = e; return rest; });
    setFile(f);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(form);
    const errs: Record<string, string> = {};
    if (!r.success) r.error.issues.forEach((i) => { errs[String(i.path[0])] ??= i.message; });
    if (!file) errs.resume = "Please upload your resume";
    setErrors(errs);
    if (Object.keys(errs).length || !r.success) return toast.error("Please fix the highlighted fields");
    add({ jobId: job.id, jobTitle: job.title, company: job.company, ...r.data, resumeName: file!.name });
    toast.success("Application submitted!", { description: `${job.title} at ${job.company}` });
    navigate({ to: "/applications" });
  };

  const inp = (k: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div><label className="mb-1 block text-sm font-medium">{label}</label>
      <input {...props} value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!errors[k]} className="field" />
      <FieldError msg={errors[k]} /></div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link to="/jobs" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Back to jobs</Link>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6 animate-fade-up">
          <div className="card-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-start gap-4">
              <CompanyBadge name={job.company} size={60} />
              <div className="flex-1">
                <h1 className="text-2xl font-bold sm:text-3xl">{job.title}</h1>
                <p className="mt-1 text-muted-foreground">{job.company} · {categories.find((c) => c.id === job.category)?.name}</p>
              </div>
              <ModeBadge mode={job.mode} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              {[{ i: MapPin, l: "Location", v: job.location }, { i: Briefcase, l: "Experience", v: job.experience }, { i: IndianRupee, l: "Salary", v: job.salary }, { i: Clock, l: "Type", v: job.type }].map(({ i: I, l, v }) => (
                <div key={l} className="rounded-xl bg-muted p-3"><p className="flex items-center gap-1 text-xs text-muted-foreground"><I className="size-3.5" />{l}</p><p className="mt-1 text-sm font-semibold">{v}</p></div>
              ))}
            </div>
          </div>
          <div className="card-surface p-6 sm:p-8">
            <h2 className="text-lg font-semibold">About the role</h2>
            <p className="mt-2 text-muted-foreground">{job.description}</p>
            <h3 className="mt-6 font-semibold">Responsibilities</h3>
            <ul className="mt-2 space-y-2">{job.responsibilities.map((r) => <li key={r} className="flex gap-2 text-muted-foreground"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-violet" />{r}</li>)}</ul>
            <h3 className="mt-6 font-semibold">Required skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">{job.skills.map((s) => <span key={s} className="rounded-lg bg-accent px-3 py-1 text-sm font-medium text-accent-foreground">{s}</span>)}</div>
            <p className="mt-6 rounded-lg bg-warning-soft p-3 text-xs text-warning">Sample listing for demonstration only — this is not a verified real vacancy.</p>
          </div>
        </div>

        <aside id="apply" className="card-surface h-fit p-6 lg:sticky lg:top-24">
          <h2 className="text-lg font-semibold">Apply Now</h2>
          {already ? (
            <div className="mt-4 rounded-xl bg-success-soft p-4 text-sm text-success">
              You've already applied to this role. <Link to="/applications" className="font-semibold underline">Track it</Link>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-4 space-y-4">
              {inp("name", "Full name", { placeholder: "Ananya Sharma" })}
              {inp("email", "Email", { type: "email", placeholder: "you@example.com" })}
              {inp("phone", "Mobile number", { inputMode: "numeric", placeholder: "9876543210", maxLength: 10 })}
              <div>
                <label className="mb-1 block text-sm font-medium">Resume</label>
                <button type="button" onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files[0]); }}
                  className={`flex w-full flex-col items-center gap-1 rounded-xl border-2 border-dashed p-5 text-sm transition hover:border-violet hover:bg-accent ${errors.resume ? "border-destructive" : ""}`}>
                  {file ? <><FileCheck2 className="size-6 text-success" /><span className="font-medium">{file.name}</span><span className="text-xs text-muted-foreground">Click to replace</span></>
                    : <><Upload className="size-6 text-violet" /><span className="font-medium">Click or drag to upload</span><span className="text-xs text-muted-foreground">PDF or Word, max 5 MB</span></>}
                </button>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
                <FieldError msg={errors.resume} />
              </div>
              <div><label className="mb-1 block text-sm font-medium">Cover note <span className="text-muted-foreground">(optional)</span></label>
                <textarea rows={3} value={form.coverNote} onChange={(e) => setForm({ ...form, coverNote: e.target.value })} className="field" aria-invalid={!!errors.coverNote} />
                <FieldError msg={errors.coverNote} /></div>
              <Btn type="submit" className="w-full">Submit application</Btn>
              <p className="text-center text-xs text-muted-foreground">Saved in this browser for the demo.</p>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
