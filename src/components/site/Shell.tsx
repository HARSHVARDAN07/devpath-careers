import { Link } from "@tanstack/react-router";
import { useState, type ReactNode, type ButtonHTMLAttributes } from "react";
import { Code2, Menu, X, Mail, Phone, MapPin, LogOut, Briefcase } from "lucide-react";
import { useUser } from "@/lib/store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Home" },
  { to: "/jobs", label: "Explore Jobs" },
  { to: "/applications", label: "Applications" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold">
      <span className="grid size-9 place-items-center rounded-xl bg-brand text-primary-foreground shadow-lift">
        <Code2 className="size-5" />
      </span>
      <span>Dev<span className="text-violet">Portal</span></span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useUser();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "!text-violet bg-accent" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/post-job" className="btn-ghost inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-primary hover:bg-muted">
            <Briefcase className="size-4" /> Post a Job
          </Link>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-full bg-accent text-sm font-bold text-accent-foreground">{user.name[0]?.toUpperCase()}</span>
              <button onClick={logout} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Log out"><LogOut className="size-4" /></button>
            </div>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-semibold hover:bg-muted">Log in</Link>
              <Link to="/register" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-primary-foreground shadow-card transition hover:opacity-90">Sign up</Link>
            </>
          )}
        </div>
        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t bg-background px-4 py-3 lg:hidden animate-fade-up">
          {[...nav, { to: "/post-job", label: "Post a Job" } as const].map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted">{n.label}</Link>
          ))}
          <div className="mt-2 flex gap-2 border-t pt-3">
            {user ? (
              <button onClick={() => { logout(); setOpen(false); }} className="flex-1 rounded-lg border px-3 py-2 text-sm font-semibold">Log out ({user.name})</button>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="flex-1 rounded-lg border px-3 py-2 text-center text-sm font-semibold">Log in</Link>
                <Link to="/register" onClick={() => setOpen(false)} className="flex-1 rounded-lg bg-brand px-3 py-2 text-center text-sm font-semibold text-primary-foreground">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-navy text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <span className="grid size-9 place-items-center rounded-xl bg-violet"><Code2 className="size-5" /></span> DevPortal
          </div>
          <p className="mt-3 text-sm opacity-70">An engineering-focused job portal for developers, freshers and IT professionals. Listings shown are sample data for demonstration.</p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Explore</h4>
          <ul className="space-y-2 text-sm opacity-75">
            <li><Link to="/jobs" className="hover:opacity-100 hover:underline">Explore Jobs</Link></li>
            <li><Link to="/applications" className="hover:underline">Applications</Link></li>
            <li><Link to="/post-job" className="hover:underline">Post a Job</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm opacity-75">
            <li><Link to="/about" className="hover:underline">About</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/register" className="hover:underline">Create account</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Contact</h4>
          <ul className="space-y-2 text-sm opacity-75">
            <li className="flex items-center gap-2"><Mail className="size-4" /> hello@devportal.example</li>
            <li className="flex items-center gap-2"><Phone className="size-4" /> +91 00000 00000</li>
            <li className="flex items-center gap-2"><MapPin className="size-4" /> Bengaluru, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5 text-center text-xs opacity-60">© {new Date().getFullYear()} DevPortal · Final-year engineering project demo</div>
    </footer>
  );
}

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="bg-hero border-b">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 animate-fade-up">
        <h1 className="text-3xl font-bold sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}

export function Btn({ className, variant = "primary", ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" }) {
  return (
    <button {...p} className={cn(
      "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50",
      variant === "primary" ? "bg-brand text-primary-foreground shadow-card hover:shadow-lift hover:opacity-95" : "border bg-background hover:bg-muted",
      className)} />
  );
}

export function FieldError({ msg }: { msg?: string }) {
  return msg ? <p className="mt-1 text-xs font-medium text-destructive">{msg}</p> : null;
}
