"use client";

import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [siteName, setSiteName] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const generate = () => {
    const lines = [
      `<!-- Primary Meta Tags -->`,
      `<title>${title}</title>`,
      `<meta name="title" content="${title}" />`,
      `<meta name="description" content="${description}" />`,
      ``,
      `<!-- Open Graph / Facebook -->`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:url" content="${url}" />`,
      `<meta property="og:title" content="${title}" />`,
      `<meta property="og:description" content="${description}" />`,
    ];
    if (image) lines.push(`<meta property="og:image" content="${image}" />`);
    if (siteName) lines.push(`<meta property="og:site_name" content="${siteName}" />`);
    lines.push(
      ``,
      `<!-- Twitter -->`,
      `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
      `<meta name="twitter:url" content="${url}" />`,
      `<meta name="twitter:title" content="${title}" />`,
      `<meta name="twitter:description" content="${description}" />`
    );
    if (image) lines.push(`<meta name="twitter:image" content="${image}" />`);
    setOutput(lines.join("\n"));
    setCopied(false);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const joinWaitlist = () => {
    if (!waitlistEmail.includes("@")) return;
    try {
      const existing = JSON.parse(localStorage.getItem("metatag_waitlist") || "[]");
      existing.push({ email: waitlistEmail, date: new Date().toISOString() });
      localStorage.setItem("metatag_waitlist", JSON.stringify(existing));
    } catch {
      // storage unavailable
    }
    setJoined(true);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 transition";

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:py-28 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1 text-sm font-medium tracking-wide backdrop-blur">
            Free SEO tool â no signup required
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold tracking-tight">
            MetaTag Generator
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-lg sm:text-xl text-indigo-100">
            Generate perfect meta tags, Open Graph tags, and Twitter cards in
            seconds. Make every link you share look stunning on Google, Facebook,
            X, and LinkedIn.
          </p>
          <a
            href="#tool"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-indigo-700 shadow-lg hover:bg-indigo-50 transition"
          >
            Generate My Tags â
          </a>
        </div>
      </section>

      {/* What This Tool Does */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is this?</h2>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Stop guessing at meta tags. Paste your page details and get perfectly formatted HTML meta tags, Open Graph tags, and Twitter cards â ready to copy into your site. Every link you share will look polished on Google, Facebook, X, and LinkedIn.
        </p>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">ð</div>
              <h3 className="text-lg font-bold text-gray-900">1. Enter your details</h3>
              <p className="mt-2 text-gray-600">Fill in your page title, description, URL, and optional image.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">â¡</div>
              <h3 className="text-lg font-bold text-gray-900">2. Click Generate</h3>
              <p className="mt-2 text-gray-600">We build production-ready HTML with all the tags you need.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">â</div>
              <h3 className="text-lg font-bold text-gray-900">3. Copy & paste</h3>
              <p className="mt-2 text-gray-600">One click copies everything to your clipboard. Drop it in your <head> tag.</p>
            </div>
        </div>
      </section>



      {/* Tool */}
      <section id="tool" className="mx-auto max-w-5xl px-4 -mt-10 pb-16">
        <div className="rounded-2xl bg-white p-6 sm:p-10 shadow-xl ring-1 ring-gray-100">
          <h2 className="text-2xl font-bold">Enter your page details</h2>
          <p className="mt-1 text-gray-500">
            Fill in the fields below and we&apos;ll build production-ready HTML for you.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">Page Title *</label>
              <input
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Awesome Product â Do More in Less Time"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">Description *</label>
              <textarea
                className={inputClass + " min-h-[90px]"}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A compelling 150â160 character summary of your page..."
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Page URL *</label>
              <input
                className={inputClass}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/page"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Image URL (optional)</label>
              <input
                className={inputClass}
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/og-image.png"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">Site Name</label>
              <input
                className={inputClass}
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="My Awesome Product"
              />
            </div>
          </div>
          <button
            onClick={generate}
            disabled={!title || !description || !url}
            className="mt-6 w-full sm:w-auto rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-3 font-semibold text-white shadow-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Generate Meta Tags
          </button>

          {output && (
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-lg font-semibold">Your meta tags</h3>
                <button
                  onClick={copy}
                  className="rounded-lg bg-indigo-100 px-5 py-2 text-sm font-semibold text-indigo-700 hover:bg-indigo-200 transition"
                >
                  {copied ? "â Copied!" : "Copy to Clipboard"}
                </button>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-gray-900 p-5 text-sm leading-relaxed text-indigo-200">
                <code>{output}</code>
              </pre>
              <p className="mt-2 text-sm text-gray-500">
                Paste this inside the <code className="rounded bg-gray-100 px-1">&lt;head&gt;</code> of your HTML.
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            ["â¡ Instant", "No waiting, no accounts. Your tags are generated locally in your browser."],
            ["ð Every platform", "Google, Facebook, X/Twitter, LinkedIn, Slack, Discord â covered."],
            ["ð Private", "Nothing leaves your device. Zero tracking of your page data."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h3 className="font-semibold text-indigo-700">{t}</h3>
              <p className="mt-2 text-sm text-gray-600">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing / Waitlist */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-100 py-16">
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="text-3xl font-bold">MetaTag Pro is coming</h2>
          <p className="mt-3 text-gray-600">
            Bulk generation, saved projects, live social previews, and JSON-LD
            schema markup. Lock in early-bird pricing.
          </p>
          <div className="mt-8 rounded-2xl bg-white p-8 shadow-lg ring-1 ring-indigo-100">
            <div className="text-5xl font-extrabold text-indigo-700">
              $7<span className="text-lg font-medium text-gray-500">/mo</span>
            </div>
            <ul className="mt-5 space-y-2 text-left text-sm text-gray-600">
              <li>â Unlimited saved projects</li>
              <li>â Bulk CSV generation</li>
              <li>â Live Facebook / X / LinkedIn previews</li>
              <li>â JSON-LD structured data builder</li>
            </ul>
            {joined ? (
              <p className="mt-6 rounded-lg bg-indigo-50 py-3 font-medium text-indigo-700">
                ð You&apos;re on the list! We&apos;ll be in touch.
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
                  className="rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white hover:bg-indigo-700 transition whitespace-nowrap"
                >
                  Join Waitlist
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-8 text-center text-sm text-gray-400">
        Â© 2025 MetaTag Generator. All rights reserved.
      </footer>
    </main>
  );
}
