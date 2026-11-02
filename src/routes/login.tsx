import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/site/AuthForm";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in – DevPortal" },
      { name: "description", content: "Log in to DevPortal to apply for engineering jobs and track applications." },
      { property: "og:title", content: "Log in – DevPortal" },
      { property: "og:description", content: "Log in to DevPortal." },
    ],
  }),
  component: () => <AuthForm mode="login" />,
});
