"use client";

import { useState } from "react";

type Priority = "High" | "Medium" | "Low";
interface ActionItem {
  action: string;
  owner: string;
  deadline: string;
  priority: Priority;
}

const TRIGGER_RE =
  /\b(will|should|shall|must|needs? to|have to|has to|going to|follow[- ]?up|assigned to|deadline|responsible for|take care of|owns)\b|^\s*(action|todo|to-do|task)\s*[:\-]/i;

const DATE_RE =
  /\b(?:by|before|due|until|on)\s+((?:the\s+)?end of\s+(?:the\s+)?(?:day|week|month|quarter|year)|(?:next\s+)?(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday)|tomorrow|today|tonight|noon|eod|eow|eom|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{1,2}(?:st|nd|rd|th)?|\d{1,2}[\/\-]\d{1,2}(?:[\/\-]\d{2,4})?)\b/i;

const DEADLINE_KW_RE = /deadline\s*(?:is|:)?\s*([A-Za-z0-9 ,\/\-]+?)(?=[.,;!?]|$)/i;

const OWNER_STOPWORDS = new Set([
  "The", "This", "That", "These", "Those", "We", "They", "He", "She", "It",
  "I", "You", "Our", "Team", "Also", "And", "But", "So", "Then", "Next",
  "Please", "Action", "Todo", "Task", "Meeting", "Notes", "Everyone", "All",
]);

function findOwner(sentence: string): string {
  let m = sentence.match(/assigned to\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  if (m) return m[1];
  m = sentence.match(
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:will|should|shall|must|needs? to|has to|is going to|to follow|owns|takes|is responsible)/
  );
  if (m && !OWNER_STOPWORDS.has(m[1].split(" ")[0])) return m[1];
  m = sentence.match(/^\s*(?:action|todo|task)\s*[:\-]\s*([A-Z][a-z]+)\s+to\b/i);
  if (m && !OWNER_STOPWORDS.has(m[1])) return m[1];
  return "—";
}

function findDeadline(sentence: string): string {
  const m = sentence.match(DATE_RE);
  if (m) return m[1].trim();
  const k = sentence.match(DEADLINE_KW_RE);
  if (k) return k[1].trim();
  return "—";
}

function inferPriority(sentence: string, deadline: string): Priority {
  if (/\b(urgent|asap|critical|immediately|top priority|high priority|blocker)\b/i.test(sentence)) return "High";
  if (
    /end of\s+(?:the\s+)?(week|month)|eow|eom|this week|tomorrow|today|eod|end of\s+(?:the\s+)?day/i.test(sentence) ||
    /tomorrow|today|eod|eow|eom|end of/i.test(deadline)
  )
    return "Medium";
  return "Low";
}

function extractActions(text: string): ActionItem[] {
  const sentences = text
    .split(/\n+|(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const items: ActionItem[] = [];
  for (const s of sentences) {
    if (!TRIGGER_RE.test(s)) continue;
    const action = s
      .replace(/^\s*[-*•]\s*/, "")
      .replace(/^(action|todo|to-do|task)\s*[:\-]\s*/i, "")
      .trim();
    if (action.length < 8) continue;
    const deadline = findDeadline(s);
    items.push({
      action,
      owner: findOwner(s),
      deadline,
      priority: inferPriority(s, deadline),
    });
  }
  return items;
}

function toMarkdown(items: ActionItem[]): string {
  const rows = items
    .map((i) => `| ${i.action.replace(/\|/g, "\\|")} | ${i.owner} | ${i.deadline} | ${i.priority} |`)
    .join("\n");
  return `## Action Items\n\n| Action | Owner | Deadline | Priority |\n| --- | --- | --- | --- |\n${rows}\n`;
}

const PRIORITY_STYLES: Record<Priority, string> = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-gray-100 text-gray-600",
};

export default function Page() {
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<ActionItem[] | null>(null);
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleExtract = () => {
    setItems(extractActions(notes));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!items) return;
    await navigator.clipboard.writeText(toMarkdown(items));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    const key = "waitlist_meeting_action_extractor";
    const list: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    if (!list.includes(email)) list.push(email);
    localStorage.setItem(key, JSON.stringify(list));
    setJoined(true);
  };

  return (
    <main className="min-h-screen bg-orange-50 text-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Meeting Action Extractor
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-orange-100 max-w-2xl mx-auto">
            Paste your meeting notes. Get a clean table of action items, owners,
            deadlines, and priorities — in seconds. No AI keys, no uploads.
          </p>
          <a
            href="#tool"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-semibold text-orange-600 shadow-lg hover:bg-orange-100 transition"
          >
            Extract Actions Free →
          </a>
        </div>
      </section>

      {/* What This Tool Does */}
      <section className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What is this?</h2>
        <p className="mt-4 text-lg text-gray-600 leading-relaxed">
          Never lose an action item again. Paste your raw meeting notes or transcript and instantly get a clean table of action items with owners, deadlines, and priority levels — extracted automatically.
        </p>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-5xl px-4 pb-12">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-gray-900 mb-10">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">📝</div>
              <h3 className="text-lg font-bold text-gray-900">1. Paste your notes</h3>
              <p className="mt-2 text-gray-600">Drop in meeting notes, transcripts, or even rough bullet points.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">⚡</div>
              <h3 className="text-lg font-bold text-gray-900">2. Click Extract</h3>
              <p className="mt-2 text-gray-600">Our parser identifies action verbs, names, dates, and urgency signals.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-2xl">✅</div>
              <h3 className="text-lg font-bold text-gray-900">3. Export & assign</h3>
              <p className="mt-2 text-gray-600">Copy the structured table as Markdown for Notion, Slack, or your PM tool.</p>
            </div>
        </div>
      </section>



      {/* Tool */}
      <section id="tool" className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-xl">
          <h2 className="text-2xl font-bold">Paste your meeting notes</h2>
          <p className="mt-1 text-sm text-gray-500">
            We scan for commitments like &quot;Sarah will…&quot;, &quot;Action:&quot;,
            &quot;follow up&quot;, &quot;by Friday&quot;, and more.
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={8}
            placeholder={"Example:\nSarah will send the Q3 report by Friday.\nAction: Mike to follow up with legal, urgent.\nWe need to update the roadmap by end of month."}
            className="mt-4 w-full rounded-lg border border-gray-300 p-4 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none resize-y"
          />
          <button
            onClick={handleExtract}
            disabled={!notes.trim()}
            className="mt-4 w-full sm:w-auto rounded-lg bg-orange-600 px-8 py-3 font-semibold text-white shadow hover:bg-orange-700 disabled:opacity-40 transition"
          >
            Extract Action Items
          </button>

          {items && (
            <div className="mt-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h3 className="text-lg font-bold">
                  {items.length} action item{items.length === 1 ? "" : "s"} found
                </h3>
                {items.length > 0 && (
                  <button
                    onClick={handleCopy}
                    className="rounded-lg border border-orange-600 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-50 transition"
                  >
                    {copied ? "✓ Copied!" : "Copy as Markdown"}
                  </button>
                )}
              </div>
              {items.length === 0 ? (
                <p className="mt-4 text-sm text-gray-500">
                  No action items detected. Try phrasing like &quot;Alex will…&quot;
                  or &quot;TODO: …&quot;.
                </p>
              ) : (
                <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
                  <table className="w-full min-w-[560px] text-left text-sm">
                    <thead className="bg-orange-100 text-orange-900">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Action</th>
                        <th className="px-4 py-3 font-semibold">Owner</th>
                        <th className="px-4 py-3 font-semibold">Deadline</th>
                        <th className="px-4 py-3 font-semibold">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {items.map((item, i) => (
                        <tr key={i} className="hover:bg-orange-50/50">
                          <td className="px-4 py-3">{item.action}</td>
                          <td className="px-4 py-3 font-medium">{item.owner}</td>
                          <td className="px-4 py-3">{item.deadline}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${PRIORITY_STYLES[item.priority]}`}
                            >
                              {item.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Pricing / Waitlist */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 p-8 sm:p-12 text-center shadow-inner">
          <h2 className="text-3xl font-bold">Pro is coming soon</h2>
          <p className="mt-2 text-gray-600 max-w-xl mx-auto">
            Slack export parsing, recurring meeting tracking, and calendar sync.
          </p>
          <div className="mt-6 inline-block rounded-xl bg-white px-8 py-5 shadow">
            <span className="text-4xl font-extrabold text-orange-600">$9</span>
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
                className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
              />
              <button
                onClick={handleJoin}
                className="rounded-lg bg-orange-600 px-6 py-3 font-semibold text-white shadow hover:bg-orange-700 transition"
              >
                Join Waitlist
              </button>
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-orange-200 bg-white py-6 text-center text-sm text-gray-500">
        © 2025 Meeting Action Extractor. All rights reserved.
      </footer>
    </main>
  );
}
