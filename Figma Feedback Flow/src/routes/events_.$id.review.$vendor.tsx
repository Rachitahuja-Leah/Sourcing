import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Check,
  X,
  ExternalLink,
  Download,
  ClipboardCheck,
  Calculator,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/events_/$id/review/$vendor")({
  head: () => ({
    meta: [{ title: "Review Submission — Sourcing Hub" }],
  }),
  component: ReviewSubmission,
});

type Item = {
  id: string;
  title: string;
  awarded: number;
  total: number;
  present: boolean;
  reviewed: boolean;
  evidence: string;
  reasoning: string;
  page: number;
};

type Category = {
  id: string;
  title: string;
  items: Item[];
};

const INITIAL: Category[] = [
  {
    id: "tech",
    title: "Technical Requirement",
    items: [
      { id: "t1", title: "Must be a standard 32 fl oz volume HDPE bottle, suitable for industrial liquid packaging.", awarded: 8.5, total: 10, present: true, reviewed: true, page: 2,
        evidence: "Full compliance with all HDPE bottle technical specifications (32 fl oz, 38/400 neck finish, 50–55g, opaque white, virgin HDPE resin). ... Volume: 32 fl oz ±0.8% — gravimetric testing",
        reasoning: "Evidence was found on pages 2 and 6, explicitly stating compliance with 32 fl oz volume and virgin HDPE material. The response thoroughly addresses the requirement by confirming the exact volume and material type. Specific numerical data for volume accuracy and material type elevate the score, demonstrating comprehensive understanding and capability." },
      { id: "t2", title: "Must be designed for compatibility with existing filling and capping machinery at Plant 19.", awarded: 8.5, total: 10, present: true, reviewed: true, page: 3, evidence: "Confirmed 38/400 neck finish compatible with existing capping lines at Plant 19.", reasoning: "Vendor confirms machinery compatibility but lacks line-test reference." },
      { id: "t3", title: "Volume Accuracy: 32 fl oz +/- 1%.", awarded: 8.5, total: 10, present: true, reviewed: true, page: 4, evidence: "32 fl oz ±0.8% — gravimetric testing per batch.", reasoning: "Exceeds spec tolerance." },
      { id: "t4", title: "Material Strength: Must withstand 5-foot drop test (full) per ASTM D2463.", awarded: 10, total: 10, present: true, reviewed: true, page: 5, evidence: "Passes ASTM D2463 drop test at 5ft for full bottles.", reasoning: "Full compliance with cited standard." },
      { id: "t5", title: "Leakage Rate: Max 0.1% of batch.", awarded: 10, total: 10, present: true, reviewed: true, page: 5, evidence: "Documented 0.05% leakage rate over last 12 months.", reasoning: "Outperforms requirement." },
    ],
  },
  {
    id: "commercial",
    title: "Commercial Requirement",
    items: [
      { id: "c1", title: "Pricing must include FOB Boston with all duties.", awarded: 7, total: 10, present: true, reviewed: true, page: 8, evidence: "FOB Boston pricing provided, duties included.", reasoning: "Pricing structure clear but missing freight tier breakdown." },
      { id: "c2", title: "Payment terms Net 45.", awarded: 6, total: 10, present: true, reviewed: true, page: 9, evidence: "Offered Net 30 with 1% early payment discount.", reasoning: "Does not meet Net 45 requirement." },
    ],
  },
  {
    id: "quality",
    title: "Quality Standard",
    items: [
      { id: "q1", title: "Vendor must demonstrate robust quality control procedures for bottle integrity and dimensions.", awarded: 10, total: 10, present: true, reviewed: true, page: 12, evidence: "In-house QA lab with SPC charts attached.", reasoning: "Comprehensive QC evidence." },
      { id: "q2", title: "Acceptable Quality Level (AQL): 1.0 for critical defects (e.g. leaks, major dimensional non-conformance).", awarded: 10, total: 10, present: true, reviewed: true, page: 12, evidence: "AQL 1.0 documented in QMS.", reasoning: "Meets AQL requirement." },
      { id: "q3", title: "Vendor must be ISO 9001:2015 certified for Quality Management System.", awarded: 10, total: 10, present: true, reviewed: true, page: 13, evidence: "ISO 9001:2015 certificate attached, valid through 2027.", reasoning: "Certificate verified." },
      { id: "q4", title: "Vendor must provide a Quality Control Plan, FAI report, and Statistical Process Control (SPC) data.", awarded: 10, total: 10, present: true, reviewed: true, page: 14, evidence: "QCP, FAI, and SPC data all provided.", reasoning: "Complete documentation supplied." },
    ],
  },
];

function ReviewSubmission() {
  const { id, vendor } = Route.useParams();
  const vendorName = vendor;

  const [categories, setCategories] = useState<Category[]>(INITIAL);
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({ tech: true, commercial: false, quality: false });
  const [selectedId, setSelectedId] = useState<string>("t1");
  const [tab, setTab] = useState<"checklist" | "cost">("checklist");

  const allItems = useMemo(() => categories.flatMap((c) => c.items.map((i) => ({ ...i, catId: c.id }))), [categories]);
  const selected = allItems.find((i) => i.id === selectedId) ?? allItems[0];
  const selectedCat = categories.find((c) => c.id === selected.catId);

  const totals = useMemo(() => {
    let awarded = 0, total = 0, reviewed = 0, count = 0;
    allItems.forEach((i) => { awarded += i.awarded; total += i.total; if (i.reviewed) reviewed++; count++; });
    return { awarded, total, reviewed, count, pct: total ? Math.round((awarded / total) * 100) : 0 };
  }, [allItems]);

  function updateSelected(patch: Partial<Item>) {
    setCategories((cats) => cats.map((c) => ({
      ...c,
      items: c.items.map((i) => (i.id === selectedId ? { ...i, ...patch } : i)),
    })));
  }

  function selectNeighbor(dir: -1 | 1) {
    const idx = allItems.findIndex((i) => i.id === selectedId);
    const next = allItems[(idx + dir + allItems.length) % allItems.length];
    setSelectedId(next.id);
    setOpenCats((o) => ({ ...o, [next.catId]: true }));
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent)] bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="px-8 pt-5">
          <Link to="/events/$id" params={{ id }} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Submissions
          </Link>
          <div className="mt-4 flex items-start justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg shadow-primary/20 ring-1 ring-white/20">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground">{vendorName}</h1>
                  <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" /> Ready for NFA
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Submitted 19 Mar 2026</span>
                  <span className="text-border">•</span>
                  <span className="inline-flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" /> RFP: HDPE Bottles & Plastic Packaging — Boston Facility</span>
                  <span className="text-border">•</span>
                  <span className="inline-flex items-center gap-1.5 text-success"><CheckCircle2 className="h-3.5 w-3.5" /> All changes saved</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-2xl border border-border/70 bg-card/60 px-4 py-2.5 text-right shadow-sm backdrop-blur">
                <div className="bg-gradient-to-br from-success to-[oklch(0.7_0.18_175)] bg-clip-text text-2xl font-semibold leading-none text-transparent">{totals.pct}%</div>
                <div className="mt-1 text-[11px] font-medium text-muted-foreground">{totals.awarded}/{totals.total} marks</div>
              </div>
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-primary to-accent px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:shadow-xl hover:shadow-primary/30">
                  <Check className="h-4 w-4" /> Finalize & Qualify
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-destructive transition hover:border-destructive/40 hover:bg-destructive/5">
                  <X className="h-4 w-4" /> Disqualify
                </button>
              </div>
            </div>
          </div>
          {/* Pill tabs */}
          <div className="mt-5 inline-flex items-center gap-1 rounded-full border border-border/70 bg-muted/40 p-1">
            <TabBtn active={tab === "checklist"} onClick={() => setTab("checklist")} icon={<ClipboardCheck className="h-3.5 w-3.5" />}>Checklist Review</TabBtn>
            <TabBtn active={tab === "cost"} onClick={() => setTab("cost")} icon={<Calculator className="h-3.5 w-3.5" />}>Cost Model</TabBtn>
          </div>
          <div className="h-4" />
        </div>
      </header>

      {tab === "checklist" ? (
        <div className="grid grid-cols-12 gap-5 p-6">
          {/* Left: Overview */}
          <aside className="col-span-12 lg:col-span-4 xl:col-span-3">
            <div className="sticky top-44 rounded-2xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-tight text-foreground">Checklist Overview</h2>
                <span className="rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">{totals.reviewed}/{totals.count} reviewed</span>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Overall score</span>
                <span className="text-xs font-medium text-foreground">{totals.awarded}<span className="text-muted-foreground">/{totals.total}</span></span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-success to-[oklch(0.7_0.18_175)] transition-all" style={{ width: `${totals.pct}%` }} />
              </div>

              <div className="mt-5 space-y-3">
                {categories.map((cat) => {
                  const reviewed = cat.items.filter((i) => i.reviewed).length;
                  const awarded = cat.items.reduce((s, i) => s + i.awarded, 0);
                  const total = cat.items.reduce((s, i) => s + i.total, 0);
                  const pct = total ? Math.round((awarded / total) * 100) : 0;
                  const open = openCats[cat.id];
                  return (
                    <div key={cat.id} className="overflow-hidden rounded-xl border border-border/60 bg-background/40">
                      <button onClick={() => setOpenCats((o) => ({ ...o, [cat.id]: !o[cat.id] }))} className="flex w-full items-center justify-between gap-2 px-3.5 py-3 text-left transition hover:bg-muted/40">
                        <span className="text-xs font-semibold text-foreground">{cat.title}</span>
                        <span className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span className="font-semibold text-foreground">{pct}%</span>
                          {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </span>
                      </button>
                      <div className="mx-3.5 h-1 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-gradient-to-r from-success to-[oklch(0.7_0.18_175)]" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="px-3.5 pt-1.5 text-[10px] text-muted-foreground">{reviewed}/{cat.items.length} reviewed · {awarded}/{total} marks</div>
                      {open && (
                        <ul className="space-y-1 p-2">
                          {cat.items.map((i) => {
                            const active = i.id === selectedId;
                            return (
                              <li key={i.id}>
                                <button
                                  onClick={() => setSelectedId(i.id)}
                                  className={`group relative flex w-full items-start gap-2.5 rounded-lg border p-2.5 text-left transition ${active ? "border-primary/40 bg-primary/5 shadow-sm" : "border-transparent hover:border-border hover:bg-muted/40"}`}
                                >
                                  {active && <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-gradient-to-b from-primary to-accent" />}
                                  <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${i.reviewed ? "bg-success text-success-foreground" : "border border-border bg-background"}`}>
                                    {i.reviewed && <Check className="h-2.5 w-2.5" />}
                                  </span>
                                  <span className="flex-1">
                                    <span className="line-clamp-2 block text-[11px] font-medium leading-snug text-foreground">{i.title}</span>
                                    <span className="mt-1 inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                      <span className="font-semibold text-foreground">{i.awarded}/{i.total}</span>
                                      <span className={`rounded-full px-1.5 py-0.5 font-medium ${i.present ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{i.present ? "Present" : "Missing"}</span>
                                    </span>
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Center: detail */}
          <section className="col-span-12 lg:col-span-4 xl:col-span-5">
            <div className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
                    {selectedCat?.title}
                  </span>
                  <h2 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-foreground">{selected.title}</h2>
                </div>
                <div className="flex shrink-0 gap-1 rounded-lg border border-border bg-background/60 p-0.5">
                  <button onClick={() => selectNeighbor(-1)} className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Previous item">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => selectNeighbor(1)} className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Next item">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-border/60 bg-gradient-to-r from-muted/40 to-transparent px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">Mark as Reviewed</div>
                  <div className="text-[11px] text-muted-foreground">Confirms human verification of this item</div>
                </div>
                <button
                  onClick={() => updateSelected({ reviewed: !selected.reviewed })}
                  className={`relative h-6 w-11 rounded-full transition ${selected.reviewed ? "bg-gradient-to-r from-primary to-accent" : "bg-muted"}`}
                  aria-label="Toggle reviewed"
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${selected.reviewed ? "left-[22px]" : "left-0.5"}`} />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Field label="Marks Awarded" required>
                  <input
                    type="number"
                    step="0.5"
                    value={selected.awarded}
                    onChange={(e) => updateSelected({ awarded: Number(e.target.value) })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-medium outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                  />
                </Field>
                <Field label="Total Possible">
                  <input
                    type="number"
                    value={selected.total}
                    disabled
                    className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2.5 text-sm font-medium text-muted-foreground"
                  />
                </Field>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Extracted Evidence</label>
                  <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary transition hover:bg-primary/10">
                    <FileText className="h-3.5 w-3.5" /> Page {selected.page}
                  </button>
                </div>
                <textarea
                  value={selected.evidence}
                  onChange={(e) => updateSelected({ evidence: e.target.value })}
                  rows={4}
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 font-mono text-xs leading-relaxed outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                <div className="mt-1 text-[10px] text-muted-foreground">{selected.evidence.length} characters</div>
              </div>

              <div className="mt-4">
                <label className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-accent" /> Score Reasoning
                </label>
                <textarea
                  value={selected.reasoning}
                  onChange={(e) => updateSelected({ reasoning: e.target.value })}
                  rows={5}
                  className="w-full rounded-lg border border-border bg-background px-3.5 py-2.5 text-sm leading-relaxed outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
                />
                <div className="mt-1 text-[10px] text-muted-foreground">{selected.reasoning.length} characters</div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-border/60 bg-gradient-to-r from-accent/5 to-transparent px-4 py-3">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  <Sparkles className="h-4 w-4 text-accent" /> AI Detection
                </span>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${selected.present ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                  <Check className="h-3 w-3" /> {selected.present ? "Present in Document" : "Not Found"}
                </span>
              </div>
            </div>
          </section>

          {/* Right: PDF viewer */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="sticky top-44 overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-2.5">
                <span className="inline-flex items-center gap-2 text-xs font-semibold text-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  RFP-Response-{vendorName.replace(/\s+/g, "-")}.pdf
                </span>
                <div className="flex gap-1">
                  <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Open">
                    <ExternalLink className="h-3.5 w-3.5" /> Open
                  </button>
                  <button className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Download">
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between bg-foreground/95 px-4 py-2 text-[11px] font-medium text-background">
                <span>Page {selected.page} of 22</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px]">Evidence highlighted</span>
              </div>
              <div className="min-h-[600px] bg-[radial-gradient(circle_at_50%_0%,oklch(0.95_0.005_270),oklch(0.9_0.005_270))] p-6">
                <div className="mx-auto max-w-md rounded-md border border-zinc-300 bg-white p-6 shadow-xl ring-1 ring-black/5">
                  <div className="border-b border-zinc-200 pb-2 text-[10px] uppercase tracking-wide text-zinc-500">
                    {vendorName} — RFP-2026-001 Response
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-zinc-800">SECTION A: COVER LETTER & EXECUTIVE SUMMARY</h3>
                  <div className="mt-3 space-y-2 text-[11px] leading-relaxed text-zinc-700">
                    <p>02 April 2026</p>
                    <p>Procurement Department</p>
                    <p>Boston Facility</p>
                    <p className="mt-2">Subject: Proposal in Response to RFP-2026-001 — Procurement of HDPE Bottles and Plastic Packaging for Boston Facility</p>
                    <p>{vendorName} is pleased to submit this comprehensive proposal in response to RFP-2026-001, issued on March 12, 2026.</p>
                    <p>We confirm the following commitments in our proposal:</p>
                    <ul className="ml-4 list-disc space-y-1">
                      <li className="rounded bg-yellow-100 px-1">Full compliance with all HDPE bottle technical specifications.</li>
                      <li>Delivery of 3,311 units to Plant 19, Boston, MA by November 15, 2025.</li>
                      <li>ISO 9001:2015 certified manufacturing with AQL 1.0 for critical defects.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      ) : (
        <div className="p-6">
          <div className="rounded-2xl border border-border/70 bg-card/80 p-6 shadow-sm backdrop-blur">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">Cost Model Breakdown</h2>
            <p className="mt-1 text-sm text-muted-foreground">Line-item cost comparison against the published RFP cost model.</p>
            <div className="mt-5 overflow-hidden rounded-xl border border-border/60">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Line item</th>
                    <th className="px-4 py-3 font-semibold">Qty</th>
                    <th className="px-4 py-3 font-semibold">Unit price</th>
                    <th className="px-4 py-3 font-semibold">Extended</th>
                    <th className="px-4 py-3 font-semibold">vs Baseline</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { item: "HDPE Bottle 32 fl oz (Variant 5)", qty: 3311, unit: 1.42, ext: 4701.62, delta: -3.1 },
                    { item: "Closures — 38/400 child-resistant", qty: 3311, unit: 0.18, ext: 595.98, delta: 2.4 },
                    { item: "Tooling amortization", qty: 1, unit: 1200, ext: 1200, delta: 0 },
                    { item: "Freight FOB Boston", qty: 1, unit: 480, ext: 480, delta: -5.0 },
                  ].map((r, i) => (
                    <tr key={i} className="border-t border-border/60 transition hover:bg-muted/20">
                      <td className="px-4 py-3 font-medium text-foreground">{r.item}</td>
                      <td className="px-4 py-3 text-foreground">{r.qty.toLocaleString()}</td>
                      <td className="px-4 py-3 text-foreground">${r.unit.toFixed(2)}</td>
                      <td className="px-4 py-3 font-semibold text-foreground">${r.ext.toLocaleString()}</td>
                      <td className="px-4 py-3 font-medium">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${r.delta < 0 ? "bg-success/10 text-success" : r.delta > 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                          {r.delta > 0 ? "+" : ""}{r.delta}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
        active
          ? "bg-card text-foreground shadow-sm ring-1 ring-border"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}
