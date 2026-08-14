"use client";

const tools = [
  { name: "MetaTag Generator", path: "/lab/metatag-gen", price: "$7/mo", color: "from-indigo-500 to-purple-500", desc: "Generate meta tags, OG tags, and Twitter cards" },
  { name: "EEAT Content Scorer", path: "/lab/eeat-scorer", price: "$9/mo", color: "from-emerald-500 to-green-500", desc: "Score articles against Google EEAT criteria" },
  { name: "Cold Email Writer", path: "/lab/cold-email-writer", price: "$12/mo", color: "from-sky-500 to-blue-500", desc: "3 personalized cold email variants" },
  { name: "Meeting Action Extractor", path: "/lab/meeting-action-items", price: "$9/mo", color: "from-amber-500 to-orange-500", desc: "Extract action items from meeting notes" },
  { name: "Testimonial Request Gen", path: "/lab/testimonial-request", price: "$7/mo", color: "from-pink-500 to-rose-500", desc: "Ready-to-send testimonial request emails" },
  { name: "Changelog Generator", path: "/lab/changelog-gen", price: "$7/mo", color: "from-teal-500 to-cyan-500", desc: "Git commits to formatted changelogs" },
  { name: "Job Description Writer", path: "/lab/jd-writer", price: "$9/mo", color: "from-violet-500 to-purple-500", desc: "Complete JDs from role details" },
  { name: "Refund Response Drafter", path: "/lab/refund-responder", price: "$7/mo", color: "from-rose-500 to-red-500", desc: "Professional refund response emails" },
  { name: "Comparison Table Builder", path: "/lab/comparison-table", price: "$9/mo", color: "from-indigo-500 to-blue-500", desc: "Beautiful product comparison tables" },
  { name: "Social Proof Widget", path: "/lab/social-proof-widget", price: "$7/mo", color: "from-teal-500 to-emerald-500", desc: "Embeddable testimonial widgets" },
];

export default function Lab() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-2 inline-block rounded-full bg-yellow-500/10 px-4 py-1 text-sm font-medium text-yellow-400">Private</div>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Agentpill Lab</h1>
        <p className="mt-3 text-lg text-gray-400">10 micro-SaaS tools. All functional. Test here before going public.</p>
        <p className="mt-1 text-sm text-gray-600">This page is not indexed, not linked, and not discoverable.</p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <a key={t.path} href={t.path} className="group rounded-2xl bg-gray-900 p-6 ring-1 ring-gray-800 hover:ring-gray-600 transition-all">
              <div className={`inline-block rounded-lg bg-gradient-to-r ${t.color} px-3 py-1 text-xs font-bold text-white`}>{t.price}</div>
              <h2 className="mt-3 text-xl font-bold group-hover:text-white transition">{t.name}</h2>
              <p className="mt-2 text-sm text-gray-400">{t.desc}</p>
              <div className="mt-4 text-sm font-medium text-gray-500 group-hover:text-indigo-400 transition">Open tool {"\u2192"}</div>
            </a>
          ))}
        </div>
        <div className="mt-12 rounded-xl bg-gray-900/50 p-6 ring-1 ring-gray-800">
          <h3 className="font-bold text-gray-300">Total MRR potential</h3>
          <p className="mt-1 text-3xl font-extrabold text-green-400">$83<span className="text-lg text-gray-500">/customer/mo</span></p>
          <p className="mt-2 text-sm text-gray-500">All tools run 100% client-side. Zero API keys. Zero backend. Zero maintenance.</p>
        </div>
      </div>
    </main>
  );
}
