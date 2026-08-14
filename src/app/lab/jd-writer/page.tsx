"use client";

import { useState } from "react";

const LEVELS: Record<string, { years: string; scope: string; verbs: string[] }> = {
  entry: { years: "0-2 years", scope: "learn quickly and grow with guidance from senior teammates", verbs: ["Support", "Assist with", "Learn and apply", "Contribute to", "Help maintain", "Participate in"] },
  mid: { years: "2-5 years", scope: "own projects end-to-end and collaborate across teams", verbs: ["Own", "Build", "Collaborate on", "Improve", "Deliver", "Contribute to"] },
  senior: { years: "5+ years", scope: "drive complex initiatives and mentor teammates", verbs: ["Lead", "Design", "Drive", "Mentor teammates on", "Champion", "Own"] },
  lead: { years: "8+ years", scope: "set technical and strategic direction for the team", verbs: ["Define the strategy for", "Lead and grow the team responsible for", "Establish best practices for", "Partner with leadership on", "Oversee", "Mentor and coach engineers on"] },
};

const WORK: Record<string, string> = {
  remote: "This is a fully remote position — work from anywhere with a strong internet connection.",
  hybrid: "This is a hybrid role, blending in-office collaboration with remote flexibility.",
  onsite: "This is an onsite role based at our office, where you'll collaborate closely with the team.",
};

export default function Page() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [dept, setDept] = useState("");
  const [level, setLevel] = useState("mid");
  const [work, setWork] = useState("remote");
  const [skills, setSkills] = useState("");
  const [salary, setSalary] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const generate = () => {
    if (!title.trim() || !company.trim()) return;
    const L = LEVELS[level];
    const skillList = skills.split(",").map((s) => s.trim()).filter(Boolean);
    const d = dept.trim() || "our team";
    const levelName = level === "entry" ? "Entry-Level" : level === "mid" ? "Mid-Level" : level.charAt(0).toUpperCase() + level.slice(1);

    const responsibilities = [
      `${L.verbs[0]} key ${d} initiatives that directly impact company goals`,
      `${L.verbs[1]} the design, development, and delivery of high-quality work as a ${title}`,
      `${L.verbs[2]} cross-functional projects with product, design, and engineering partners`,
      `${L.verbs[3]} processes, tooling, and documentation to raise the bar for the whole team`,
      `${L.verbs[4]} a culture of quality, feedback, and continuous improvement`,
      `${L.verbs[5]} planning, estimation, and prioritization within ${d}`,
      `Communicate progress, risks, and results clearly to stakeholders`,
      `Stay current with industry trends and bring new ideas to the team`,
    ];

    const must = skillList.length
      ? skillList.map((s) => `Proficiency with ${s}`)
      : [`Demonstrated experience relevant to the ${title} role`];

    const text = `# ${title}\n${company} · ${d.charAt(0).toUpperCase() + d.slice(1)} · ${levelName} · ${work.charAt(0).toUpperCase() + work.slice(1)}${salary.trim() ? ` · ${salary.trim()}` : ""}\n
## About ${company}
At ${company}, we believe great products are built by great people. We're a passionate, fast-moving team on a mission to deliver exceptional value to our customers — and we're just getting started. Joining ${company} means joining a culture of ownership, curiosity, and craft, where your work matters from day one.\n
## Role Overview
We're looking for a ${levelName} ${title} to join ${d}. In this role, you'll ${L.scope}. ${WORK[work]}${salary.trim() ? ` The compensation range for this role is ${salary.trim()}.` : ""}\n
## Key Responsibilities
${responsibilities.map((r) => `- ${r}`).join("\n")}\n
## Requirements
- ${L.years} of relevant professional experience
${must.map((m) => `- ${m}`).join("\n")}
- Strong communication and collaboration skills
- A proactive, ownership-driven mindset\n
## Nice to Have
- Experience in a fast-paced startup or high-growth environment
- Familiarity with adjacent tools and technologies beyond the core stack
- Prior experience mentoring or onboarding teammates
- Contributions to open source, community, or industry writing\n
## Benefits & Perks
- Competitive salary and meaningful equity
- Comprehensive health, dental, and vision coverage
- Flexible PTO and paid parental leave
- Annual learning & development stipend
- Home office / equipment budget
- Team offsites and regular social events\n
## Our Commitment to Diversity, Equity & Inclusion
${company} is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees. We welcome applicants of every background, identity, and experience — if you're excited about this role but don't meet every requirement, we encourage you to apply anyway.\n
## How to Apply
Send your resume (and anything else you'd like us to see) through our careers page or to careers@${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com. We review every application and aim to respond within one week. We can't wait to meet you!`;

    setOutput(text);
    setCopied(false);
  };

  const copy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const joinWaitlist = () => {
    if (!email.includes("@")) return;
    const list = JSON.parse(localStorage.getItem("jdwriter_waitlist") || "[]");
    list.push({ email, date: new Date().toISOString() });
    localStorage.setItem("jdwriter_waitlist", JSON.stringify(list));
    setJoined(true);
  };

  const inputCls = "w-full rounded-lg border border-violet-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200";
  const labelCls = "mb-1.5 block text-sm font-medium text-gray-700";

  return (
    <main className="min-h-screen bg-violet-50 text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-700 via-purple-700 to-fuchsia-700 px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wider">Hiring made easy</span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">JD Writer</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100">Generate polished, inclusive job descriptions in seconds. Fill in the basics — we handle the rest.</p>
          <a href="#tool" className="mt-8 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-violet-700 shadow-lg transition hover:bg-violet-100">Write a Job Description →</a>
        </div>
      </section>

      {/* What This Tool Does */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is this?</h2>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Write a complete, professional job description in under 60 seconds. Enter the role details and get a polished JD with responsibilities, requirements, benefits, and a DEI statement — ready to post on any job board.
        </p>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl">📝</div>
              <h3 className="text-lg font-bold text-gray-900">1. Enter role details</h3>
              <p className="mt-2 text-gray-600">Job title, company, level, work type, and key skills needed.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl">⚡</div>
              <h3 className="text-lg font-bold text-gray-900">2. Click Generate</h3>
              <p className="mt-2 text-gray-600">We build a complete JD with 8 sections tailored to the experience level.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl">✅</div>
              <h3 className="text-lg font-bold text-gray-900">3. Copy & post</h3>
              <p className="mt-2 text-gray-600">Copy the formatted text and paste it into LinkedIn, Indeed, or your ATS.</p>
            </div>
        </div>
      </section>



      {/* Tool */}
      <section id="tool" className="px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-xl shadow-violet-100 sm:p-10">
          <h2 className="mb-6 text-2xl font-bold">Build your job description</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Job Title *</label>
              <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Frontend Engineer" />
            </div>
            <div>
              <label className={labelCls}>Company Name *</label>
              <input className={inputCls} value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Acme Inc." />
            </div>
            <div>
              <label className={labelCls}>Department</label>
              <input className={inputCls} value={dept} onChange={(e) => setDept(e.target.value)} placeholder="e.g. Engineering" />
            </div>
            <div>
              <label className={labelCls}>Experience Level</label>
              <select className={inputCls} value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="entry">Entry</option>
                <option value="mid">Mid</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Work Type</label>
              <select className={inputCls} value={work} onChange={(e) => setWork(e.target.value)}>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Salary Range (optional)</label>
              <input className={inputCls} value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="e.g. $120k–$150k" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Key Skills (comma-separated)</label>
              <input className={inputCls} value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g. React, TypeScript, CSS, Testing" />
            </div>
          </div>
          <button onClick={generate} disabled={!title.trim() || !company.trim()} className="mt-6 w-full rounded-xl bg-violet-600 py-3 font-semibold text-white shadow-md transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-40">
            Generate Job Description
          </button>

          {output && (
            <div className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-bold">Your Job Description</h3>
                <button onClick={copy} className="rounded-lg bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-200">
                  {copied ? "✓ Copied!" : "Copy as Text"}
                </button>
              </div>
              <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-xl border border-violet-100 bg-violet-50/60 p-5 text-sm leading-relaxed">{output}</pre>
            </div>
          )}
        </div>
      </section>

      {/* Pricing / Waitlist */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-xl rounded-2xl bg-gradient-to-br from-violet-700 to-purple-800 p-8 text-center text-white shadow-xl sm:p-10">
          <h2 className="text-2xl font-bold">Pro Plan — $9/mo</h2>
          <p className="mt-2 text-violet-200">Unlimited JDs, custom templates, ATS-ready exports, and team sharing. Coming soon.</p>
          {joined ? (
            <p className="mt-6 rounded-xl bg-white/15 py-3 font-semibold">🎉 You're on the list! We'll be in touch.</p>
          ) : (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" className="flex-1 rounded-xl border-0 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-300" />
              <button onClick={joinWaitlist} className="rounded-xl bg-fuchsia-400 px-6 py-3 font-semibold text-purple-950 transition hover:bg-fuchsia-300">Join Waitlist</button>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-violet-100 bg-white py-6 text-center text-sm text-gray-500">
        © 2025 JD Writer. All rights reserved.
      </footer>
    </main>
  );
}
