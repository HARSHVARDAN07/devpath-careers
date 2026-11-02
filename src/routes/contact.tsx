import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin } from "lucide-react";
import { Btn, FieldError, PageHeader } from "@/components/site/Shell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact DevPortal" },
      { name: "description", content: "Get in touch with the DevPortal team for support or hiring questions." },
      { property: "og:title", content: "Contact DevPortal" },
      { property: "og:description", content: "Get in touch with the DevPortal team." },
    ],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Enter a valid email address").max(255),
  message: z.string().trim().min(10, "Message should be at least 10 characters").max(1000, "Keep it under 1000 characters"),
});

function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) { const er: Record<string, string> = {}; r.error.issues.forEach((i) => { er[String(i.path[0])] ??= i.message; }); setErrors(er); return; }
    setErrors({}); setF({ name: "", email: "", message: "" });
    toast.success("Thanks! Your message has been noted for this demo.");
  };
  return (
    <>
      <PageHeader title="Contact us" subtitle="Questions, feedback or hiring enquiries — we'd love to hear from you." />
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {[{ i: Mail, t: "Email", v: "hello@devportal.example" }, { i: Phone, t: "Phone", v: "+91 00000 00000" }, { i: MapPin, t: "Office", v: "Bengaluru, Karnataka" }].map(({ i: I, t, v }) => (
            <div key={t} className="card-surface flex items-center gap-4 p-5"><span className="grid size-11 place-items-center rounded-xl bg-accent text-violet"><I className="size-5" /></span><div><p className="text-sm text-muted-foreground">{t}</p><p className="font-semibold">{v}</p></div></div>
          ))}
        </div>
        <form onSubmit={submit} noValidate className="card-surface space-y-4 p-6">
          {(["name", "email"] as const).map((k) => (
            <div key={k}><label className="mb-1 block text-sm font-medium capitalize">{k}</label>
              <input type={k === "email" ? "email" : "text"} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!errors[k]} className="field" />
              <FieldError msg={errors[k]} /></div>
          ))}
          <div><label className="mb-1 block text-sm font-medium">Message</label>
            <textarea rows={5} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} aria-invalid={!!errors.message} className="field" />
            <FieldError msg={errors.message} /></div>
          <Btn type="submit" className="w-full">Send message</Btn>
        </form>
      </div>
    </>
  );
}
