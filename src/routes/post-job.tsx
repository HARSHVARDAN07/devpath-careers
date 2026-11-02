import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { categories } from "@/data/jobs";
import { useJobs } from "@/lib/store";
import { Btn, FieldError, PageHeader } from "@/components/site/Shell";

export const Route = createFileRoute("/post-job")({
  head: () => ({
    meta: [
      { title: "Post a Job – DevPortal for Employers" },
      { name: "description", content: "Employers can post engineering roles with skills, salary in INR and work mode." },
      { property: "og:title", content: "Post a Job – DevPortal" },
      { property: "og:description", content: "Post engineering roles to reach developers." },
    ],
  }),
  component: PostJob,
});

const schema = z.object({
  title: z.string().trim().min(3, "Job title is required").max(100),
  company: z.string().trim().min(2, "Company name is required").max(100),
  location: z.string().trim().min(2, "Location is required").max(100),
  experience: z.string().trim().min(1, "Experience is required").max(50),
  salary: z.string().trim().min(2, "Salary range is required, e.g. ₹8 – 12 LPA").max(50),
  skills: z.string().trim().min(1, "Add at least one skill"),
  type: z.enum(["Full-time", "Internship", "Contract"]),
  mode: z.enum(["Remote", "Hybrid", "Onsite"]),
  category: z.enum(["backend", "frontend", "cloud", "data", "mobile", "qa"]),
  description: z.string().trim().min(30, "Description should be at least 30 characters").max(2000),
});
type F = z.input<typeof schema>;

function PostJob() {
  const { addJob } = useJobs();
  const navigate = useNavigate();
  const [f, setF] = useState<F>({ title: "", company: "", location: "", experience: "", salary: "", skills: "", type: "Full-time", mode: "Hybrid", category: "backend", description: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) { const er: Record<string, string> = {}; r.error.issues.forEach((i) => { er[String(i.path[0])] ??= i.message; }); setErrors(er); toast.error("Please fix the highlighted fields"); return; }
    const d = r.data;
    const job = addJob({ ...d, skills: d.skills.split(",").map((s) => s.trim()).filter(Boolean), responsibilities: ["See description for details"] });
    toast.success("Job posted!");
    navigate({ to: "/jobs/$id", params: { id: job.id } });
  };

  const text = (k: keyof F, label: string, ph = "") => (
    <div><label className="mb-1 block text-sm font-medium">{label}</label>
      <input value={f[k]} placeholder={ph} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!errors[k]} className="field" />
      <FieldError msg={errors[k]} /></div>
  );
  const select = (k: "type" | "mode" | "category", label: string, opts: { v: string; l: string }[]) => (
    <div><label className="mb-1 block text-sm font-medium">{label}</label>
      <select value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value } as F)} className="field">{opts.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}</select></div>
  );

  return (
    <>
      <PageHeader title="Post a Job" subtitle="Reach developers looking for their next role. Posted jobs are saved in this browser for the demo." />
      <form onSubmit={submit} noValidate className="mx-auto mt-10 max-w-3xl card-surface space-y-5 p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          {text("title", "Job title", "Backend Engineer")}
          {text("company", "Company", "Your company")}
          {text("location", "Location", "Bengaluru")}
          {text("experience", "Experience", "2–4 years")}
          {text("salary", "Salary range (INR)", "₹10 – 16 LPA")}
          {text("skills", "Skills (comma separated)", "Java, Spring Boot, AWS")}
          {select("category", "Category", categories.map((c) => ({ v: c.id, l: c.name })))}
          {select("type", "Employment type", ["Full-time", "Internship", "Contract"].map((v) => ({ v, l: v })))}
          {select("mode", "Work mode", ["Remote", "Hybrid", "Onsite"].map((v) => ({ v, l: v })))}
        </div>
        <div><label className="mb-1 block text-sm font-medium">Description</label>
          <textarea rows={5} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} aria-invalid={!!errors["description"]} className="field" />
          <FieldError msg={errors["description"]} /></div>
        <Btn type="submit" className="w-full sm:w-auto">Publish job</Btn>
      </form>
    </>
  );
}
