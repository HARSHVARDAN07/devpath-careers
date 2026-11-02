export type WorkMode = "Remote" | "Hybrid" | "Onsite";
export type CategoryId = "backend" | "frontend" | "cloud" | "data" | "mobile" | "qa";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  skills: string[];
  type: "Full-time" | "Internship" | "Contract";
  mode: WorkMode;
  category: CategoryId;
  posted: string;
  description: string;
  responsibilities: string[];
  employerPosted?: boolean;
}

export const categories: { id: CategoryId; name: string; blurb: string }[] = [
  { id: "backend", name: "Java & Backend Development", blurb: "Java, Spring Boot, Node, APIs" },
  { id: "frontend", name: "Frontend & Full Stack", blurb: "React, TypeScript, Next.js" },
  { id: "cloud", name: "Cloud & DevOps", blurb: "AWS, Kubernetes, CI/CD" },
  { id: "data", name: "Data Science & AI", blurb: "Python, ML, LLMs, Analytics" },
  { id: "mobile", name: "Mobile Development", blurb: "Android, iOS, Flutter" },
  { id: "qa", name: "QA & Testing", blurb: "Selenium, Automation, SDET" },
];

export const trendingTags = ["Java", "Spring Boot", "React", "Python", "AWS", "Microservices"];
export const companies = ["Infosys", "Razorpay", "Oracle", "Swiggy", "Zomato"];

const d = (title: string) =>
  `This is a sample listing for a ${title} role, created for demonstration purposes only. It is not a verified real vacancy. You'll work with a collaborative engineering team to design, build and ship reliable software.`;

export const sampleJobs: Job[] = [
  { id: "j1", title: "Java Backend Developer", company: "Infosys", location: "Bengaluru", experience: "2–4 years", salary: "₹8 – 14 LPA", skills: ["Java", "Spring Boot", "Microservices", "MySQL"], type: "Full-time", mode: "Hybrid", category: "backend", posted: "2 days ago", description: d("Java Backend Developer"), responsibilities: ["Build REST APIs with Spring Boot", "Design microservice boundaries", "Write unit and integration tests"] },
  { id: "j2", title: "Senior React Engineer", company: "Razorpay", location: "Bengaluru", experience: "4–7 years", salary: "₹25 – 40 LPA", skills: ["React", "TypeScript", "Redux", "GraphQL"], type: "Full-time", mode: "Remote", category: "frontend", posted: "1 day ago", description: d("Senior React Engineer"), responsibilities: ["Own dashboard features end to end", "Mentor junior engineers", "Improve web performance"] },
  { id: "j3", title: "Cloud DevOps Engineer", company: "Oracle", location: "Hyderabad", experience: "3–6 years", salary: "₹18 – 30 LPA", skills: ["AWS", "Kubernetes", "Terraform", "CI/CD"], type: "Full-time", mode: "Onsite", category: "cloud", posted: "3 days ago", description: d("Cloud DevOps Engineer"), responsibilities: ["Automate infrastructure with Terraform", "Run Kubernetes clusters", "Own deployment pipelines"] },
  { id: "j4", title: "Data Scientist – ML", company: "Swiggy", location: "Bengaluru", experience: "2–5 years", salary: "₹20 – 35 LPA", skills: ["Python", "PyTorch", "SQL", "ML"], type: "Full-time", mode: "Hybrid", category: "data", posted: "5 days ago", description: d("Data Scientist"), responsibilities: ["Build demand forecasting models", "Run A/B experiments", "Deploy models to production"] },
  { id: "j5", title: "Android Developer", company: "Zomato", location: "Gurugram", experience: "1–3 years", salary: "₹10 – 18 LPA", skills: ["Kotlin", "Jetpack Compose", "Android"], type: "Full-time", mode: "Onsite", category: "mobile", posted: "1 week ago", description: d("Android Developer"), responsibilities: ["Ship features in the consumer app", "Improve app startup time", "Collaborate with designers"] },
  { id: "j6", title: "QA Automation Engineer", company: "Infosys", location: "Pune", experience: "0–2 years", salary: "₹4 – 7 LPA", skills: ["Selenium", "Java", "TestNG", "API Testing"], type: "Full-time", mode: "Onsite", category: "qa", posted: "4 days ago", description: d("QA Automation Engineer"), responsibilities: ["Write automated UI tests", "Test REST APIs", "Report and track defects"] },
  { id: "j7", title: "Full Stack Developer (MERN)", company: "Swiggy", location: "Remote, India", experience: "2–4 years", salary: "₹14 – 22 LPA", skills: ["React", "Node.js", "MongoDB", "AWS"], type: "Full-time", mode: "Remote", category: "frontend", posted: "2 days ago", description: d("Full Stack Developer"), responsibilities: ["Build full stack features", "Maintain internal tools", "Write clean, tested code"] },
  { id: "j8", title: "Software Engineer Intern – Backend", company: "Razorpay", location: "Bengaluru", experience: "Fresher", salary: "₹40,000 – 60,000 / month", skills: ["Java", "Python", "DSA", "SQL"], type: "Internship", mode: "Hybrid", category: "backend", posted: "Today", description: d("Backend Intern"), responsibilities: ["Work on payment services", "Learn production practices", "Pair with senior engineers"] },
  { id: "j9", title: "Generative AI Engineer", company: "Oracle", location: "Bengaluru", experience: "3–5 years", salary: "₹28 – 45 LPA", skills: ["Python", "LLMs", "LangChain", "AWS"], type: "Full-time", mode: "Hybrid", category: "data", posted: "3 days ago", description: d("Generative AI Engineer"), responsibilities: ["Build LLM-powered features", "Evaluate model quality", "Optimise inference cost"] },
  { id: "j10", title: "Flutter Developer", company: "Zomato", location: "Remote, India", experience: "1–3 years", salary: "₹9 – 15 LPA", skills: ["Flutter", "Dart", "Firebase"], type: "Contract", mode: "Remote", category: "mobile", posted: "6 days ago", description: d("Flutter Developer"), responsibilities: ["Build cross-platform screens", "Integrate APIs", "Fix production bugs"] },
  { id: "j11", title: "Site Reliability Engineer", company: "Razorpay", location: "Bengaluru", experience: "4–8 years", salary: "₹30 – 50 LPA", skills: ["Linux", "Kubernetes", "Prometheus", "Go"], type: "Full-time", mode: "Hybrid", category: "cloud", posted: "1 week ago", description: d("Site Reliability Engineer"), responsibilities: ["Define SLOs and alerts", "Lead incident response", "Scale core infrastructure"] },
  { id: "j12", title: "SDET – Microservices", company: "Oracle", location: "Chennai", experience: "2–5 years", salary: "₹12 – 20 LPA", skills: ["Java", "RestAssured", "Microservices", "Jenkins"], type: "Full-time", mode: "Hybrid", category: "qa", posted: "2 days ago", description: d("SDET"), responsibilities: ["Build test frameworks", "Automate contract tests", "Integrate tests into CI"] },
];
