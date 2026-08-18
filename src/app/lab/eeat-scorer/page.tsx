"use client";

import { useState } from "react";

type DimScore = { score: number; suggestions: string[] };
type Results = {
  experience: DimScore;
  expertise: DimScore;
  authoritativeness: DimScore;
  trustworthiness: DimScore;
  overall: number;
};

function countMatches(text: string, patterns: RegExp[]): number {
  return patterns.reduce((sum, p) => sum + (text.match(p) || []).length, 0);
}

function scoreText(raw: string): Results {
  const text = raw.toLowerCase();
  const words = raw.trim().split(/\s+/).length;
  const scale = Math.max(1, words / 300); // normalize per ~300 words

  // Experience
  const firstPerson = countMatches(text, [/\bi\b/g, /\bwe\b/g, /\bmy\b/g, /\bour\b/g]);
  const expPhrases = countMatches(text, [
    /my experience/g, /i tested/g, /i tried/g, /i found/g, /we tested/g,
    /hands-on/g, /firsthand/g, /case stud/g, /for example/g, /for instance/g,
  ]);
  const expScore = Math.min(100, Math.round((firstPerson / scale) * 4 + (expPhrases / scale) * 18));
  const expSug: string[] = [];
  if (firstPerson / scale < 3) expSug.push('Add first-person language ("I", "we", "my") to show direct involvement.');
  if (!/case stud|for example|for instance/.test(text)) expSug.push("Include a specific example or case study from real usage.");
  if (!/i tested|i tried|we tested|hands-on|firsthand/.test(text)) expSug.push('Describe hands-on testing ("I tested...", "In my experience...").');
  if (expSug.length === 0) expSug.push("Strong experience signals — keep sharing concrete, first-hand details.");

  // Expertise
  const dataMentions = countMatches(text, [
    /\d+(\.\d+)?%/g, /\bstud(y|ies)\b/g, /\bdata\b/g, /\bresearch\b/g,
    /\bstatistic/g, /\banalysis\b/g, /\bsurvey/g,
  ]);
  const citations = countMatches(text, [
    /according to/g, /\bcited?\b/g, /\bsource/g, /\breference/g, /\bpublished\b/g, /\bjournal\b/g,
  ]);
  const techDensity = countMatches(text, [/\b\w{10,}\b/g]) / Math.max(1, words);
  const xpScore = Math.min(100, Math.round((dataMentions / scale) * 10 + (citations / scale) * 12 + techDensity * 300));
  const xpSug: string[] = [];
  if (!/\d+(\.\d+)?%/.test(text)) xpSug.push("Add statistics or percentages to back up claims.");
  if (citations === 0) xpSug.push('Cite studies or experts ("According to a 2024 study...").');
  if (techDensity < 0.03) xpSug.push("Use precise, domain-specific terminology where appropriate.");
  if (xpSug.length === 0) xpSug.push("Solid expertise signals — data and citations are well represented.");

  // Authoritativeness
  const links = countMatches(raw, [/https?:\/\//g, /www\./g]);
  const headings = countMatches(raw, [/^#{1,6}\s/gm, /^[A-Z][^.!?\n]{2,60}$/gm]);
  const authRefs = countMatches(text, [/\bexpert/g, /\bofficial\b/g, /\binstitut/g, /\buniversit/g, /\.gov\b/g, /\.edu\b/g]);
  const authScore = Math.min(100, Math.round((links / scale) * 15 + Math.min(headings, 10) * 6 + (authRefs / scale) * 10));
  const authSug: string[] = [];
  if (links === 0) authSug.push("Link to authoritative external sources (studies, official docs).");
  if (headings < 2) authSug.push("Structure content with clear headings and subheadings.");
  if (authRefs === 0) authSug.push("Reference recognized experts, institutions, or official bodies.");
  if (authSug.length === 0) authSug.push("Good authority signals — structure and sourcing look strong.");

  // Trustworthiness
  const balanced = countMatches(text, [
    /\bhowever\b/g, /\bon the other hand\b/g, /\balthough\b/g, /\bwhile\b/g,
    /\bdrawback/g, /\blimitation/g, /\bcon(s)?\b/g, /\bdownside/g,
  ]);
  const disclaimers = countMatches(text, [
    /disclaimer/g, /disclosure/g, /not (financial|medical|legal) advice/g,
    /consult (a|your)/g, /results may vary/g, /affiliate/g,
  ]);
  const hype = countMatches(text, [
    /\bbest ever\b/g, /\bguaranteed\b/g, /\bmiracle\b/g, /\bsecret\b/g,
    /\bnever fails\b/g, /\b100% (safe|effective)\b/g, /!!+/g,
  ]);
  const trustScore = Math.max(0, Math.min(100, Math.round(40 + (balanced / scale) * 10 + disclaimers * 15 - hype * 12)));
  const trustSug: string[] = [];
  if (balanced === 0) trustSug.push('Present both sides — mention limitations or drawbacks ("However...", "One downside...").');
  if (disclaimers === 0) trustSug.push("Add a disclaimer or disclosure where relevant (affiliate, medical, financial).");
  if (hype > 0) trustSug.push('Tone down hype words like "guaranteed" or "miracle" — they erode trust.');
  if (trustSug.length === 0) trustSug.push("Balanced, measured tone detected — great for reader trust.");

  const overall = Math.round((expScore + xpScore + authScore + trustScore) / 4);
  return {
    experience: { score: expScore, suggestions: expSug },
    expertise: { score: xpScore, suggestions: xpSug },
    authoritativeness: { score: authScore, suggestions: authSug },
    trustworthiness: { score: trustScore, suggestions: trustSug },
    overall,
  };
}

function ratingInfo(score: number) {
  if (score >= 70) return { label: "Strong", color: "text-green-600", bg: "bg-green-500", ring: "ring-green-200" };
  if (score >= 40) return { label: "Needs Work", color: "text-yellow-600", bg: "bg-yellow-500", ring: "ring-yellow-200" };
  return { label: "Weak", color: "text-red-600", bg: "bg-red-500", ring: "ring-red-200" };
}

export default function Home() {
  const [text, setText] = useState("");
  const [results, setResults] = useState<Results | null>(null);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const analyze = () => setResults(scoreText(text));

  const joinWaitlist = () => {
    if (!waitlistEmail.includes("@")) return;
    try {
      const existing = JSON.parse(localStorage.getItem("eeat_waitlist") || "[]");
      existing.push({ email: waitlistEmail, date: new Date().toISOString() });
      localStorage.setItem("eeat_waitlist", JSON.stringify(existing));
    } catch {}
    setJoined(true);
  };

  const dims: [string, DimScore][] = results
    ? [
        ["Experience", results.experience],
        ["Expertise", results.expertise],
        ["Authoritativeness", results.authoritativeness],
        ["Trustworthiness", results.trustworthiness],
      ]
    : [];

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:py-28 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium backdrop-blur">
            Built for Google&apos;s quality guidelines
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight">
            EEAT Content Scorer
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-lg sm:text-xl text-emerald-100">
            Paste your article and instantly see how it scores on Experience,
            Expertise, Authoritativeness, and Trust — the signals Google rewards.
          </p>
          <a
            href="#tool"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3.5 font-semibold text-emerald-700 shadow-lg hover:bg-emerald-50 transition"
          >
            Score My Content →
          </a>
        </div>
      </section>

      {/* What This Tool Does */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is this?</h2>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Google rewards content that demonstrates Experience, Expertise, Authoritativeness, and Trustworthiness. Paste your article and get an instant EEAT score with specific, actionable fixes to improve your rankings.
        </p>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">📝</div>
              <h3 className="text-lg font-bold text-gray-900">1. Paste your article</h3>
              <p className="mt-2 text-gray-600">Drop your full article text into the editor — blog post, landing page, anything.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">⚡</div>
              <h3 className="text-lg font-bold text-gray-900">2. Click Score</h3>
              <p className="mt-2 text-gray-600">Our analyzer scans for 40+ EEAT signals across all four dimensions.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">✅</div>
              <h3 className="text-lg font-bold text-gray-900">3. Fix & improve</h3>
              <p className="mt-2 text-gray-600">Get a color-coded score and specific suggestions to boost each dimension.</p>
            </div>
        </div>
      </section>



      {/* Tool */}
      <section id="tool" className="mx-auto max-w-5xl px-4 -mt-10 pb-16">
        <div className="rounded-2xl bg-white p-6 sm:p-10 shadow-xl ring-1 ring-gray-100">
          <h2 className="text-2xl font-bold">Paste your article</h2>
          <textarea
            className="mt-4 w-full min-h-[220px] rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your full article text here (at least 100 words for accurate scoring)..."
          />
          <div className="mt-2 text-sm text-gray-500">
            {text.trim() ? text.trim().split(/\s+/).length : 0} words
          </div>
          <button
            onClick={analyze}
            disabled={text.trim().split(/\s+/).length < 20}
            className="mt-4 w-full sm:w-auto rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-3 font-semibold text-white shadow-md hover:from-emerald-700 hover:to-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Analyze Content
          </button>

          {results && (
            <div className="mt-10">
              {/* Overall */}
              <div className="flex flex-col items-center rounded-2xl bg-gray-50 p-8 ring-1 ring-gray-100">
                <div
                  className={`flex h-32 w-32 items-center justify-center rounded-full ${ratingInfo(results.overall).bg} text-white shadow-lg`}
                >
                  <span className="text-4xl font-extrabold">{results.overall}</span>
                </div>
                <p className={`mt-4 text-xl font-bold ${ratingInfo(results.overall).color}`}>
                  {ratingInfo(results.overall).label}
                </p>
                <p className="text-sm text-gray-500">Overall EEAT Score (0–100)</p>
              </div>

              {/* Dimensions */}
              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {dims.map(([name, d]) => {
                  const r = ratingInfo(d.score);
                  return (
                    <div key={name} className={`rounded-xl bg-white p-6 shadow-sm ring-1 ${r.ring}`}>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{name}</h3>
                        <span className={`text-2xl font-extrabold ${r.color}`}>{d.score}</span>
                      </div>
                      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div className={`h-full rounded-full ${r.bg} transition-all`} style={{ width: `${d.score}%` }} />
                      </div>
                      <ul className="mt-4 space-y-2 text-sm text-gray-600">
                        {d.suggestions.map((s) => (
                          <li key={s} className="flex gap-2">
                            <span className="text-emerald-600">•</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing / Waitlist */}
      <section className="bg-gradient-to-br from-emerald-50 to-green-100 py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="text-3xl font-bold">EEAT Scorer Pro is coming</h2>
          <p className="mt-3 text-gray-600">
            Full-site audits, competitor comparisons, tracked score history, and
            AI-powered rewrite suggestions.
          </p>
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-emerald-100">
            <div className="text-5xl font-extrabold text-emerald-700">
              $9<span className="text-lg font-medium text-gray-500">/mo</span>
            </div>
            <ul className="mt-5 space-y-2 text-left text-sm text-gray-600">
              <li>✓ Unlimited article scoring</li>
              <li>✓ Full-site EEAT audits by URL</li>
              <li>✓ Score history & progress tracking</li>
              <li>✓ Competitor benchmarking</li>
            </ul>
            {joined ? (
              <p className="mt-6 rounded-lg bg-emerald-50 py-3 font-medium text-emerald-700">
                🎉 You&apos;re on the list! We&apos;ll be in touch.
              </p>
            ) : (
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <input
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  type="email"
                  value={waitlistEmail}
                  onChange={(e) => setWaitlistEmail(e.target.value)}
                  placeholder="you@company.com"
                />
                <button
                  onClick={joinWaitlist}
                  className="rounded-lg bg-emerald-600 px-6 py-2.5 font-semibold text-white hover:bg-emerald-700 transition whitespace-nowrap"
                >
                  Join Waitlist
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-8 text-center text-sm text-gray-400">
        © 2025 EEAT Content Scorer. All rights reserved.
      </footer>
    </main>
  );
}
