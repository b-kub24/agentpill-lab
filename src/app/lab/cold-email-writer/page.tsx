"use client";

import { useState } from "react";

type EmailVariant = { approach: string; subject: string; body: string };

export default function Home() {
  const [prospectName, setProspectName] = useState("");
  const [prospectCompany, setProspectCompany] = useState("");
  const [prospectRole, setProspectRole] = useState("");
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [keyBenefit, setKeyBenefit] = useState("");
  const [variants, setVariants] = useState<EmailVariant[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const generate = () => {
    const firstName = prospectName.trim().split(" ")[0] || "there";

    const painPoint: EmailVariant = {
      approach: "Pain Point",
      subject: `${prospectCompany} + ${keyBenefit.toLowerCase()}?`,
      body: `Hi ${firstName},

Most ${prospectRole}s I talk to at companies like ${prospectCompany} are stuck spending hours on work that should take minutes — and it's usually not their fault. The tooling just hasn't kept up.

That's exactly why we built ${productName}: ${productDesc}

Teams using it typically see ${keyBenefit.toLowerCase()} within the first few weeks.

Worth a quick 15-minute look? Happy to show you how it'd work at ${prospectCompany} specifically.

Best,
[Your Name]`,
    };

    const socialProof: EmailVariant = {
      approach: "Social Proof",
      subject: `How teams like ${prospectCompany} get ${keyBenefit.toLowerCase()}`,
      body: `Hi ${firstName},

Quick one — we recently helped three companies in your space achieve ${keyBenefit.toLowerCase()}, and I think ${prospectCompany} could see similar results.

The tool behind it is ${productName}: ${productDesc}

As the ${prospectRole} at ${prospectCompany}, you'd be the person who'd feel this impact most directly, so I wanted to reach out to you first.

Open to a short call this week? I'll bring the numbers.

Best,
[Your Name]`,
    };

    const question: EmailVariant = {
      approach: "Question",
      subject: `Quick question, ${firstName}`,
      body: `Hi ${firstName},

If you could get ${keyBenefit.toLowerCase()} at ${prospectCompany} without adding headcount or changing your workflow — what would that free your team up to do?

I ask because that's exactly what ${productName} does: ${productDesc}

Most ${prospectRole}s we work with are surprised how fast it pays for itself.

Would it be crazy to grab 15 minutes and find out if it fits ${prospectCompany}?

Best,
[Your Name]`,
    };

    setVariants([painPoint, socialProof, question]);
    setCopiedIdx(null);
  };

  const copy = async (v: EmailVariant, idx: number) => {
    try {
      await navigator.clipboard.writeText(`Subject: ${v.subject}\n\n${v.body}`);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } catch {}
  };

  const joinWaitlist = () => {
    if (!waitlistEmail.includes("@")) return;
    try {
      const existing = JSON.parse(localStorage.getItem("coldemail_waitlist") || "[]");
      existing.push({ email: waitlistEmail, date: new Date().toISOString() });
      localStorage.setItem("coldemail_waitlist", JSON.stringify(existing));
    } catch {}
    setJoined(true);
  };

  const ready =
    prospectName && prospectCompany && prospectRole && productName && productDesc && keyBenefit;

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 transition";

  const fields: [string, string, (v: string) => void, string][] = [
    ["Prospect Name", prospectName, setProspectName, "Jane Smith"],
    ["Prospect Company", prospectCompany, setProspectCompany, "Acme Corp"],
    ["Prospect Role", prospectRole, setProspectRole, "Head of Marketing"],
    ["Your Product Name", productName, setProductName, "PipelineBoost"],
  ];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-sky-600 via-blue-600 to-blue-800 text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:py-28 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur">
            3 proven frameworks, zero writer&apos;s block
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight">
            Cold Email Writer
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-lg sm:text-xl text-sky-100">
            Turn six quick inputs into three personalized cold emails — Pain
            Point, Social Proof, and Question openers — ready to send in seconds.
          </p>
          <a
            href="#tool"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3.5 font-semibold text-blue-700 shadow-lg hover:bg-sky-50 transition"
          >
            Write My Emails →
          </a>
        </div>
      </section>

      {/* What This Tool Does */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is this?</h2>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Craft personalized cold emails that actually get opened. Enter your prospect details and product info, and get three proven email frameworks — Pain Point, Social Proof, and Question — each with subject lines optimized for replies.
        </p>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-2xl">📝</div>
              <h3 className="text-lg font-bold text-gray-900">1. Describe your prospect</h3>
              <p className="mt-2 text-gray-600">Enter their name, company, role, and what you're selling.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-2xl">⚡</div>
              <h3 className="text-lg font-bold text-gray-900">2. Click Generate</h3>
              <p className="mt-2 text-gray-600">We create three distinct email variants using proven outreach frameworks.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-2xl">✅</div>
              <h3 className="text-lg font-bold text-gray-900">3. Pick & send</h3>
              <p className="mt-2 text-gray-600">Choose the approach that fits, copy it, and personalize the last 10%.</p>
            </div>
        </div>
      </section>



      {/* Tool */}
      <section id="tool" className="mx-auto max-w-5xl px-4 -mt-10 pb-16">
        <div className="rounded-2xl bg-white p-6 sm:p-10 shadow-xl ring-1 ring-gray-100">
          <h2 className="text-2xl font-bold">Tell us about your prospect</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {fields.map(([label, value, setter, ph]) => (
              <div key={label}>
                <label className="mb-1.5 block text-sm font-medium">{label} *</label>
                <input
                  className={inputClass}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  placeholder={ph}
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">Your Product Description *</label>
              <textarea
                className={inputClass + " min-h-[80px]"}
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                placeholder="an AI tool that automates outbound follow-ups so reps never drop a lead."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">Key Benefit *</label>
              <input
                className={inputClass}
                value={keyBenefit}
                onChange={(e) => setKeyBenefit(e.target.value)}
                placeholder="30% more booked meetings"
              />
            </div>
          </div>
          <button
            onClick={generate}
            disabled={!ready}
            className="mt-6 w-full sm:w-auto rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 px-8 py-3 font-semibold text-white shadow-md hover:from-sky-700 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Generate 3 Email Variants
          </button>
        </div>

        {/* Output */}
        {variants.length > 0 && (
          <div className="mt-10 space-y-6">
            {variants.map((v, idx) => (
              <div key={v.approach} className="rounded-2xl bg-white p-6 sm:p-8 shadow-lg ring-1 ring-sky-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <span className="inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
                      Variant {idx + 1} · {v.approach}
                    </span>
                    <h3 className="mt-2 font-semibold text-gray-900">
                      Subject: <span className="text-blue-700">{v.subject}</span>
                    </h3>
                  </div>
                  <button
                    onClick={() => copy(v, idx)}
                    className="rounded-lg bg-sky-100 px-5 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-200 transition self-start"
                  >
                    {copiedIdx === idx ? "✓ Copied!" : "Copy Email"}
                  </button>
                </div>
                <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-gray-50 p-5 text-sm leading-relaxed text-gray-700 font-sans">
                  {v.body}
                </pre>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pricing / Waitlist */}
      <section className="bg-gradient-to-br from-sky-50 to-blue-100 py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="text-3xl font-bold">Cold Email Pro is coming</h2>
          <p className="mt-3 text-gray-600">
            Follow-up sequences, A/B subject line testing, CRM export, and 20+
            additional frameworks.
          </p>
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-sky-100">
            <div className="text-5xl font-extrabold text-blue-700">
              $12<span className="text-lg font-medium text-gray-500">/mo</span>
            </div>
            <ul className="mt-5 space-y-2 text-left text-sm text-gray-600">
              <li>✓ 20+ email frameworks & follow-up sequences</li>
              <li>✓ Bulk personalization from CSV</li>
              <li>✓ A/B subject line generator</li>
              <li>✓ Export to your CRM or sequencer</li>
            </ul>
            {joined ? (
              <p className="mt-6 rounded-lg bg-sky-50 py-3 font-medium text-blue-700">
                🎉 You&apos;re on the list! We&apos;ll be in touch.
              </p>
            ) : (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <input
                  className={inputClass}
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="you@company.com"
                />
                <button
                  onClick={joinWaitlist}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700 transition whitespace-nowrap"
                >
                  Join Waitlist
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-8 text-center text-sm text-gray-400">
        © 2025 Cold Email Writer. All rights reserved.
      </footer>
    </main>
  );
}
