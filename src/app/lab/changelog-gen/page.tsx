"use client";

import { useState } from "react";

interface Categories {
  breaking: string[];
  feat: string[];
  fix: string[];
  docs: string[];
  other: string[];
}

const CATEGORY_META: { key: keyof Categories; title: string }[] = [
  { key: "breaking", title: "💥 Breaking Changes" },
  { key: "feat", title: "✨ Features" },
  { key: "fix", title: "🐛 Bug Fixes" },
  { key: "docs", title: "📝 Documentation" },
  { key: "other", title: "🔧 Other" },
];

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function parseCommits(text: string): Categories {
  const cats: Categories = { breaking: [], feat: [], fix: [], docs: [], other: [] };
  for (const raw of text.split("\n")) {
    const line = raw
      .trim()
      .replace(/^[-*•]\s+/, "")
      .replace(/^[a-f0-9]{7,40}\s+/i, "");
    if (!line) continue;

    // BREAKING CHANGE footer/keyword
    if (/breaking[- ]change/i.test(line)) {
      const msg = line.replace(/^.*breaking[- ]change[:\s]*/i, "").trim() || line;
      cats.breaking.push(capitalize(msg));
      continue;
    }

    // Conventional commit: type(scope)!: message
    const conv = line.match(/^(\w+)(\([^)]*\))?(!)?:\s*(.+)$/);
    if (conv) {
      const type = conv[1].toLowerCase();
      const bang = conv[3] === "!";
      const scope = conv[2] ? conv[2].slice(1, -1) : "";
      const msg = (scope ? `**${scope}:** ` : "") + capitalize(conv[4].trim());
      if (bang) cats.breaking.push(msg);
      else if (type === "feat" || type === "feature") cats.feat.push(msg);
      else if (type === "fix" || type === "hotfix" || type === "bugfix") cats.fix.push(msg);
      else if (type === "docs" || type === "doc") cats.docs.push(msg);
      else if (["style", "refactor", "test", "chore", "perf", "build", "ci", "revert"].includes(type))
        cats.other.push(msg);
      else cats.other.push(capitalize(line));
      continue;
    }

    // Non-conventional: keyword detection
    const msg = capitalize(line);
    if (/^(add|adds|added|create|creates|created|implement|implements|implemented|introduce|new|support)\b/i.test(line))
      cats.feat.push(msg);
    else if (/^(fix|fixes|fixed|resolve|resolves|resolved|patch|patched|repair|correct|corrected)\b/i.test(line) || /\bbug\b/i.test(line))
      cats.fix.push(msg);
    else if (/^(doc|docs|document|documented)\b/i.test(line) || /\breadme\b/i.test(line) || /\bdocumentation\b/i.test(line))
      cats.docs.push(msg);
    else if (/^(remove|removes|removed|delete|deleted|drop|dropped|deprecate|deprecated|update|updates|updated|upgrade|bump|refactor|rename|clean|cleanup|improve|improved|optimize|optimized)\b/i.test(line))
      cats.other.push(msg);
    else cats.other.push(msg);
  }
  return cats;
}

function toMarkdown(cats: Categories): string {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10);
  let md = `# Changelog\n\n## ${dateStr}\n`;
  for (const { key, title } of CATEGORY_META) {
    const items = cats[key];
    if (items.length === 0) continue;
    md += `\n### ${title}\n\n`;
    for (const item of items) md += `- ${item}\n`;
  }
  return md;
}

export default function Page() {
  const [commits, setCommits] = useState("");
  const [cats, setCats] = useState<Categories | null>(null);
  const [view, setView] = useState<"markdown" | "preview">("preview");
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleGenerate = () => {
    setCats(parseCommits(commits));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!cats) return;
    await navigator.clipboard.writeText(toMarkdown(cats));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    const key = "waitlist_changelog_generator";
    const list: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    if (!list.includes(email)) list.push(email);
    localStorage.setItem(key, JSON.stringify(list));
    setJoined(true);
  };

  const total = cats ? CATEGORY_META.reduce((n, c) => n + cats[c.key].length, 0) : 0;
  const dateStr = new Date().toISOString().slice(0, 10);

  const renderBold = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith("**") && p.endsWith("**") ? <strong key={i}>{p.slice(2, -2)}</strong> : p
    );
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Changelog Generator
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
            Paste your git commits, get a beautiful categorized changelog.
            Conventional commits and plain messages both work — all in your browser.
          </p>
          <a
            href="#tool"
            className="mt-8 inline-block rounded-lg bg-teal-500 px-8 py-3 font-semibold text-white shadow-lg hover:bg-teal-400 transition"
          >
            Generate Changelog →
          </a>
        </div>
      </section>

      {/* What This Tool Does */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is this?</h2>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Turn messy git commit messages into a professional, categorized changelog in seconds. Supports conventional commits and plain English — automatically groups into Features, Bug Fixes, Docs, and Breaking Changes.
        </p>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-2xl">📝</div>
              <h3 className="text-lg font-bold text-gray-900">1. Paste commits</h3>
              <p className="mt-2 text-gray-600">Copy your git log output and paste it in — one commit per line.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-2xl">⚡</div>
              <h3 className="text-lg font-bold text-gray-900">2. Click Generate</h3>
              <p className="mt-2 text-gray-600">We parse, categorize, and format everything with emoji headers and dates.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-2xl">✅</div>
              <h3 className="text-lg font-bold text-gray-900">3. Preview & copy</h3>
              <p className="mt-2 text-gray-600">Toggle between Markdown and rendered preview, then copy for your release.</p>
            </div>
        </div>
      </section>



      {/* Tool */}
      <section id="tool" className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl font-bold">Paste your commit messages</h2>
          <p className="mt-1 text-sm text-slate-500">
            One per line. Tip: run{" "}
            <code className="rounded bg-slate-100 px-1.5 py-0.5 text-teal-700">
              git log --oneline
            </code>{" "}
            and paste the output.
          </p>
          <textarea
            value={commits}
            onChange={(e) => setCommits(e.target.value)}
            rows={8}
            placeholder={"feat(auth): add Google OAuth login\nfix: resolve crash on empty cart\ndocs: update API reference\nchore: bump dependencies\nfeat!: drop support for Node 16\nadded dark mode toggle"}
            className="mt-4 w-full rounded-lg border border-slate-300 p-4 font-mono text-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none resize-y"
          />
          <button
            onClick={handleGenerate}
            disabled={!commits.trim()}
            className="mt-4 w-full sm:w-auto rounded-lg bg-teal-600 px-8 py-3 font-semibold text-white shadow hover:bg-teal-700 disabled:opacity-40 transition"
          >
            Generate Changelog
          </button>

          {cats && (
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-lg font-bold">
                  {total} change{total === 1 ? "" : "s"} categorized
                </h3>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-slate-300 p-0.5 text-sm font-medium">
                    <button
                      onClick={() => setView("preview")}
                      className={`rounded-md px-3 py-1.5 transition ${view === "preview" ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setView("markdown")}
                      className={`rounded-md px-3 py-1.5 transition ${view === "markdown" ? "bg-teal-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}
                    >
                      Markdown
                    </button>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="rounded-lg border border-teal-600 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-50 transition"
                  >
                    {copied ? "✓ Copied!" : "Copy Markdown"}
                  </button>
                </div>
              </div>

              {view === "markdown" ? (
                <pre className="mt-4 overflow-x-auto rounded-lg bg-slate-900 p-5 text-sm text-slate-100 leading-relaxed">
                  {toMarkdown(cats)}
                </pre>
              ) : (
                <div className="mt-4 rounded-lg border border-slate-200 p-5 sm:p-6">
                  <h4 className="text-2xl font-extrabold">Changelog</h4>
                  <p className="mt-1 border-b border-slate-200 pb-3 text-lg font-semibold text-teal-700">
                    {dateStr}
                  </p>
                  {total === 0 && (
                    <p className="mt-4 text-sm text-slate-500">No commits parsed.</p>
                  )}
                  {CATEGORY_META.map(({ key, title }) =>
                    cats[key].length === 0 ? null : (
                      <div key={key} className="mt-5">
                        <h5 className="font-bold text-slate-800">{title}</h5>
                        <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-600">
                          {cats[key].map((item, i) => (
                            <li key={i}>{renderBold(item)}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Pricing / Waitlist */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-2xl bg-slate-900 p-8 sm:p-12 text-center text-white">
          <h2 className="text-3xl font-bold">Simple pricing</h2>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="rounded-xl bg-slate-800 p-6 text-left">
              <p className="font-semibold text-slate-300">Free</p>
              <p className="mt-2 text-3xl font-extrabold">$0</p>
              <p className="mt-2 text-sm text-slate-400">3 changelogs per month</p>
            </div>
            <div className="rounded-xl border-2 border-teal-400 bg-slate-800 p-6 text-left">
              <p className="font-semibold text-teal-300">Pro — coming soon</p>
              <p className="mt-2 text-3xl font-extrabold">
                $7<span className="text-base font-normal text-slate-400">/mo</span>
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Unlimited changelogs, GitHub sync, custom templates
              </p>
            </div>
          </div>
          {joined ? (
            <p className="mt-8 font-semibold text-teal-300">
              🎉 You&apos;re on the list! We&apos;ll be in touch.
            </p>
          ) : (
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="flex-1 rounded-lg border border-slate-600 bg-slate-800 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-400 focus:ring-2 focus:ring-teal-900 outline-none"
              />
              <button
                onClick={handleJoin}
                className="rounded-lg bg-teal-500 px-6 py-3 font-semibold text-white shadow hover:bg-teal-400 transition"
              >
                Join Waitlist
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © 2025 Changelog Generator. All rights reserved.
      </footer>
    </main>
  );
}
