import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "@/components/site/AuthForm";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create an account – DevPortal" },
      { name: "description", content: "Register on DevPortal as a job seeker or an employer." },
      { property: "og:title", content: "Create an account – DevPortal" },
      { property: "og:description", content: "Register on DevPortal as a job seeker or employer." },
    ],
  }),
  component: () => <AuthForm mode="register" />,
});
