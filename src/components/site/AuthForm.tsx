import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useUser } from "@/lib/store";
import { Btn, FieldError } from "@/components/site/Shell";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
const registerSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  password: z.string().min(8, "Use at least 8 characters").regex(/\d/, "Include at least one number"),
  confirm: z.string(),
  role: z.enum(["candidate", "employer"]),
}).refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Passwords do not match" });

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { login, register } = useUser();
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "", role: "candidate" as "candidate" | "employer" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isReg = mode === "register";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = isReg ? registerSchema.safeParse(f) : loginSchema.safeParse(f);
    if (!r.success) { const er: Record<string, string> = {}; r.error.issues.forEach((i) => { er[String(i.path[0])] ??= i.message; }); setErrors(er); return; }
    setErrors({});
    const err = isReg ? register({ name: f.name.trim(), email: f.email.trim(), password: f.password, role: f.role }) : login(f.email.trim(), f.password);
    if (err) { setErrors({ form: err }); return; }
    toast.success(isReg ? "Account created — welcome to DevPortal!" : "Welcome back!");
    navigate({ to: isReg && f.role === "employer" ? "/post-job" : "/jobs" });
  };

  const field = (k: "name" | "email" | "password" | "confirm", label: string, type = "text") => (
    <div><label className="mb-1 block text-sm font-medium">{label}</label>
      <input type={type} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!errors[k]} className="field" autoComplete={k === "email" ? "email" : undefined} />
      <FieldError msg={errors[k]} /></div>
  );

  return (
    <div className="bg-hero flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-14">
      <div className="card-surface w-full max-w-md p-8 shadow-lift animate-fade-up">
        <h1 className="text-2xl font-bold">{isReg ? "Create your account" : "Welcome back"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{isReg ? "Join DevPortal as a job seeker or employer." : "Log in to continue your job search."}</p>
        {isReg && (
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-xl bg-muted p-1">
            {(["candidate", "employer"] as const).map((r) => (
              <button key={r} type="button" onClick={() => setF({ ...f, role: r })} className={`rounded-lg py-2 text-sm font-semibold transition ${f.role === r ? "bg-background shadow-card text-violet" : "text-muted-foreground"}`}>
                {r === "candidate" ? "Job seeker" : "Employer"}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={submit} noValidate className="mt-6 space-y-4">
          {isReg && field("name", "Full name")}
          {field("email", "Email", "email")}
          {field("password", "Password", "password")}
          {isReg && field("confirm", "Confirm password", "password")}
          {errors["form"] && <p className="rounded-lg bg-destructive-soft p-3 text-sm text-destructive">{errors["form"]}</p>}
          <Btn type="submit" className="w-full">{isReg ? "Create account" : "Log in"}</Btn>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isReg ? <>Already have an account? <Link to="/login" className="font-semibold text-violet">Log in</Link></>
            : <>New to DevPortal? <Link to="/register" className="font-semibold text-violet">Create an account</Link></>}
        </p>
        <p className="mt-3 text-center text-xs text-muted-foreground">Demo sign-in: accounts are stored only in this browser.</p>
      </div>
    </div>
  );
}
