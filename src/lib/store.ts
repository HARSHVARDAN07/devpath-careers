import { useEffect, useState, useCallback } from "react";
import { sampleJobs, type Job } from "@/data/jobs";

export type AppStatus = "Applied" | "Under Review" | "Interview Scheduled" | "Selected" | "Rejected";
export const statuses: AppStatus[] = ["Applied", "Under Review", "Interview Scheduled", "Selected", "Rejected"];

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  resumeName: string;
  coverNote: string;
  status: AppStatus;
  appliedAt: string;
}
export interface User { name: string; email: string; role: "candidate" | "employer" }

const KEYS = { apps: "devportal.applications", jobs: "devportal.postedJobs", user: "devportal.user", accounts: "devportal.accounts" };
const EVT = "devportal:store";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new Event(EVT));
}

function useStored<T>(key: string, fallback: T) {
  const [val, setVal] = useState<T>(fallback);
  useEffect(() => {
    const sync = () => setVal(read(key, fallback));
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener("storage", sync); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return val;
}

export function useApplications() {
  const apps = useStored<Application[]>(KEYS.apps, []);
  const add = useCallback((a: Omit<Application, "id" | "status" | "appliedAt">) => {
    const list = read<Application[]>(KEYS.apps, []);
    list.unshift({ ...a, id: crypto.randomUUID(), status: "Applied", appliedAt: new Date().toISOString() });
    write(KEYS.apps, list);
  }, []);
  const setStatus = useCallback((id: string, status: AppStatus) => {
    write(KEYS.apps, read<Application[]>(KEYS.apps, []).map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);
  const remove = useCallback((id: string) => {
    write(KEYS.apps, read<Application[]>(KEYS.apps, []).filter((a) => a.id !== id));
  }, []);
  return { apps, add, setStatus, remove };
}

export function useJobs() {
  const posted = useStored<Job[]>(KEYS.jobs, []);
  const all = [...posted, ...sampleJobs];
  const addJob = useCallback((j: Omit<Job, "id" | "posted" | "employerPosted">) => {
    const list = read<Job[]>(KEYS.jobs, []);
    const job: Job = { ...j, id: "p" + Date.now(), posted: "Just now", employerPosted: true };
    list.unshift(job);
    write(KEYS.jobs, list);
    return job;
  }, []);
  return { jobs: all, posted, addJob };
}

export function useUser() {
  const user = useStored<User | null>(KEYS.user, null);
  const register = (u: User & { password: string }) => {
    const accounts = read<(User & { password: string })[]>(KEYS.accounts, []);
    if (accounts.some((a) => a.email.toLowerCase() === u.email.toLowerCase())) return "An account with this email already exists.";
    accounts.push(u);
    write(KEYS.accounts, accounts);
    write(KEYS.user, { name: u.name, email: u.email, role: u.role });
    return null;
  };
  const login = (email: string, password: string) => {
    const acc = read<(User & { password: string })[]>(KEYS.accounts, []).find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!acc) return "No account found with this email. Please register first.";
    if (acc.password !== password) return "Incorrect password. Please try again.";
    write(KEYS.user, { name: acc.name, email: acc.email, role: acc.role });
    return null;
  };
  const logout = () => write(KEYS.user, null);
  return { user, register, login, logout };
}
