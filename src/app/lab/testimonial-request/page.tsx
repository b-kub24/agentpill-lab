"use client";

import { useState } from "react";

interface Inputs {
  customerName: string;
  customerCompany: string;
  productName: string;
  keyResult: string;
  relationshipLength: string;
}

interface EmailVariant {
  label: string;
  description: string;
  subject: string;
  body: string;
}

function buildVariants(i: Inputs): EmailVariant[] {
  const first = i.customerName.split(" ")[0] || i.customerName;
  return [
    {
      label: "Quick Ask",
      description: "Short, casual, low-friction — perfect for busy customers.",
      subject: `Quick favor, ${first}?`,
      body: `Hi ${first},

Hope things are going great at ${i.customerCompany}! It's been awesome working with you over the past ${i.relationshipLength}.

I noticed you've ${i.keyResult} with ${i.productName} — that's exactly the kind of win we love to see.

Would you mind sharing 2-3 sentences about your experience? Even a quick note would mean the world to us, and we'd feature it (with your approval) on our site.

No pressure at all — and thanks either way!

Best,
[Your name]`,
    },
    {
      label: "Guided",
      description: "Includes specific questions so they know exactly what to write.",
      subject: `${first}, would you share your ${i.productName} story?`,
      body: `Hi ${first},

Working with you and the team at ${i.customerCompany} over the last ${i.relationshipLength} has been a highlight for us — especially seeing you ${i.keyResult}.

We're collecting customer stories, and yours would be incredibly valuable. If you have 5 minutes, answering any of these would be perfect:

1. What problem were you trying to solve before ${i.productName}?
2. What made you choose us over other options?
3. What specific results have you seen? (e.g., "${i.keyResult}")
4. What surprised you most about working with us?
5. Would you recommend ${i.productName} to others? Why?

Feel free to answer in a quick reply — we'll polish it into a testimonial and send it back for your approval before using it anywhere.

Thank you so much!

Best,
[Your name]`,
    },
    {
      label: "Video Request",
      description: "Asks for a short video testimonial with ready-made talking points.",
      subject: `30-second video? We'd love to feature ${i.customerCompany}`,
      body: `Hi ${first},

You've achieved something worth celebrating: ${i.keyResult} with ${i.productName}. After ${i.relationshipLength} of working together, we'd love to put ${i.customerCompany} in the spotlight.

Would you be open to recording a short (30-60 second) video testimonial? A phone selfie video is perfect — no production needed.

A few talking points to make it easy:
• Who you are and what ${i.customerCompany} does
• The challenge you faced before ${i.productName}
• The result: ${i.keyResult}
• Who you'd recommend ${i.productName} to

You can record it whenever convenient and just reply with the file or a link. We'll handle the rest, and you'll get final approval before anything goes live.

Thanks so much for considering it!

Best,
[Your name]`,
    },
  ];
}

function buildSurvey(i: Inputs): string {
  return `Testimonial Survey — ${i.productName}

Hi ${i.customerName.split(" ")[0] || "there"}! This takes ~3 minutes. Thanks for helping us out.

1. What problem were you trying to solve before using ${i.productName}?

2. What results have you achieved since? (numbers are great if you have them!)

3. What's your favorite thing about ${i.productName}?

4. On a scale of 0-10, how likely are you to recommend ${i.productName} to a colleague? Why?

5. May we use your answers as a public testimonial with your name and company (${i.customerCompany})?  [ ] Yes  [ ] Yes, anonymously  [ ] No`;
}

const EMPTY: Inputs = {
  customerName: "",
  customerCompany: "",
  productName: "",
  keyResult: "",
  relationshipLength: "",
};

export default function Page() {
  const [inputs, setInputs] = useState<Inputs>(EMPTY);
  const [variants, setVariants] = useState<EmailVariant[] | null>(null);
  const [survey, setSurvey] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const set = (k: keyof Inputs) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setInputs({ ...inputs, [k]: e.target.value });

  const ready = Object.values(inputs).every((v) => v.trim().length > 0);

  const handleGenerate = () => {
    setVariants(buildVariants(inputs));
    setSurvey(buildSurvey(inputs));
    setCopiedIdx(null);
  };

  const copy = async (text: string, idx: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleJoin = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    const key = "waitlist_testimonial_request_generator";
    const list: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    if (!list.includes(email)) list.push(email);
    localStorage.setItem(key, JSON.stringify(list));
    setJoined(true);
  };

  const fields: { key: keyof Inputs; label: string; placeholder: string }[] = [
    { key: "customerName", label: "Customer name", placeholder: "Jane Smith" },
    { key: "customerCompany", label: "Customer company", placeholder: "Acme Corp" },
    { key: "productName", label: "Your product name", placeholder: "LaunchPad CRM" },
    { key: "keyResult", label: "Key result they achieved", placeholder: "cut onboarding time by 40%" },
    { key: "relationshipLength", label: "Relationship length", placeholder: "6 months" },
  ];

  return (
    <main className="min-h-screen bg-rose-50 text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600 text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Testimonial Request Generator
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-rose-100 max-w-2xl mx-auto">
            Stop staring at a blank email. Generate 3 ready-to-send testimonial
            request emails plus a survey — personalized to your customer in seconds.
          </p>
          <a
            href="#tool"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-rose-600 shadow-lg hover:bg-rose-100 transition"
          >
            Generate My Emails →
          </a>
        </div>
      </section>

      {/* What This Tool Does */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is this?</h2>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Asking customers for testimonials is awkward. We make it effortless. Enter your customer details and get three ready-to-send email templates — from a casual quick ask to a guided survey — plus a bonus testimonial questionnaire.
        </p>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl">📝</div>
              <h3 className="text-lg font-bold text-gray-900">1. Enter customer info</h3>
              <p className="mt-2 text-gray-600">Name, company, your product, and the key result they achieved.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl">⚡</div>
              <h3 className="text-lg font-bold text-gray-900">2. Click Generate</h3>
              <p className="mt-2 text-gray-600">Get three email variants: Quick Ask, Guided Questions, and Video Request.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl">✅</div>
              <h3 className="text-lg font-bold text-gray-900">3. Send & collect</h3>
              <p className="mt-2 text-gray-600">Copy your favorite, hit send, and watch the testimonials roll in.</p>
            </div>
        </div>
      </section>



      {/* Tool */}
      <section id="tool" className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl font-bold">Tell us about your customer</h2>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.key} className={f.key === "keyResult" ? "sm:col-span-2" : ""}>
                <label className="block text-sm font-medium text-gray-700">{f.label}</label>
                <input
                  type="text"
                  value={inputs[f.key]}
                  onChange={set(f.key)}
                  placeholder={f.placeholder}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleGenerate}
            disabled={!ready}
            className="mt-6 w-full sm:w-auto rounded-lg bg-rose-600 px-8 py-3 font-semibold text-white shadow hover:bg-rose-700 disabled:opacity-40 transition"
          >
            Generate 3 Email Variants
          </button>

          {variants && (
            <div className="mt-8 space-y-6">
              {variants.map((v, idx) => (
                <div key={v.label} className="rounded-xl border border-rose-200 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-rose-100 px-5 py-3">
                    <div>
                      <span className="font-bold text-rose-800">{v.label}</span>
                      <p className="text-xs text-rose-600">{v.description}</p>
                    </div>
                    <button
                      onClick={() => copy(`Subject: ${v.subject}\n\n${v.body}`, idx)}
                      className="shrink-0 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition"
                    >
                      {copiedIdx === idx ? "✓ Copied!" : "Copy Email"}
                    </button>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm font-semibold text-gray-800">
                      Subject: <span className="font-normal">{v.subject}</span>
                    </p>
                    <pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-gray-600 leading-relaxed">
                      {v.body}
                    </pre>
                  </div>
                </div>
              ))}

              <div className="rounded-xl border border-rose-200 overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-pink-100 px-5 py-3">
                  <div>
                    <span className="font-bold text-pink-800">Bonus: 5-Question Survey</span>
                    <p className="text-xs text-pink-600">
                      Send this instead if your customer prefers a form.
                    </p>
                  </div>
                  <button
                    onClick={() => copy(survey, 99)}
                    className="shrink-0 rounded-lg bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700 transition"
                  >
                    {copiedIdx === 99 ? "✓ Copied!" : "Copy Survey"}
                  </button>
                </div>
                <pre className="whitespace-pre-wrap px-5 py-4 font-sans text-sm text-gray-600 leading-relaxed">
                  {survey}
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing / Waitlist */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-2xl bg-gradient-to-br from-pink-100 to-rose-100 p-8 sm:p-12 text-center shadow-inner">
          <h2 className="text-3xl font-bold">Pro is coming soon</h2>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">
            Follow-up sequences, testimonial wall widget, and CRM integrations.
          </p>
          <div className="mt-6 inline-block rounded-xl bg-white px-8 py-5 shadow">
            <span className="text-4xl font-extrabold text-rose-600">$7</span>
            <span className="text-gray-500">/month</span>
          </div>
          {joined ? (
            <p className="mt-6 font-semibold text-green-700">
              🎉 You&apos;re on the list! We&apos;ll be in touch.
            </p>
          ) : (
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none"
              />
              <button
                onClick={handleJoin}
                className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white shadow hover:bg-rose-700 transition"
              >
                Join Waitlist
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-rose-200 bg-white py-6 text-center text-sm text-gray-500">
        © 2025 Testimonial Request Generator. All rights reserved.
      </footer>
    </main>
  );
}
