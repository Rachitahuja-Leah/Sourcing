import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  X,
  Calendar,
  ChevronDown,
  Plus,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Layers,
  Package,
  Upload,
  Trash2,
  Pencil,
  FileDown,
} from "lucide-react";

export const Route = createFileRoute("/sourcing/new")({
  head: () => ({
    meta: [
      { title: "New Sourcing Event — Sourcing Hub" },
      { name: "description", content: "Create a new sourcing event in three steps." },
    ],
  }),
  component: NewSourcingEvent,
});

type Step = 0 | 1 | 2;
type SourcingMode = "pr" | "direct";
type ScopeType = "goods" | "services" | "mixed" | "framework";

const SCOPE_TYPE_LABEL: Record<ScopeType, string> = {
  goods: "Goods",
  services: "Services",
  mixed: "Mixed",
  framework: "Framework",
};

function NewSourcingEvent() {
  const [step, setStep] = useState<Step>(0);
  const [mode, setMode] = useState<SourcingMode>("pr");
  const [scopeType, setScopeType] = useState<ScopeType>("goods");
  const [directItems, setDirectItems] = useState<DirectItem[]>(SAMPLE_DIRECT_ITEMS);
  const navigate = useNavigate();

  const steps = ["Basic Details", "Sourcing Scope", "Review"];
  const nextLabel =
    step === 0 ? "Next: Sourcing Scope" : step === 1 ? "Next: Review" : "Submit for Approval";

  function onNext() {
    if (step < 2) setStep((step + 1) as Step);
    else navigate({ to: "/events/$id", params: { id: "steel-materials-q2" } });
  }
  function onBack() {
    if (step > 0) setStep((step - 1) as Step);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center gap-4 border-b border-border bg-card px-8 py-5">
        <Link to="/" className="text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Sourcing Hub</h1>
      </header>

      <div className="flex flex-1">
        {/* Step rail */}
        <aside className="w-72 shrink-0 px-8 py-10">
          <ol className="space-y-5">
            {steps.map((label, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li key={label} className="flex items-center gap-3">
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      done
                        ? "border-[oklch(0.62_0.16_155)] bg-[oklch(0.62_0.16_155)]"
                        : active
                          ? "border-accent"
                          : "border-border"
                    }`}
                  >
                    {done && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </span>
                  <span
                    className={`text-sm font-semibold ${
                      active
                        ? "text-foreground"
                        : done
                          ? "text-muted-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </aside>

        <section className="flex-1 px-6 pb-32 pt-8">
          {step === 0 && <BasicDetails scopeType={scopeType} onScopeTypeChange={setScopeType} />}
          {step === 1 && (
            <SourcingScopeStep
              mode={mode}
              onModeChange={setMode}
              scopeType={scopeType}
              directItems={directItems}
              onDirectItemsChange={setDirectItems}
            />
          )}
          {step === 2 && (
            <ReviewStep mode={mode} scopeType={scopeType} directItems={directItems} />
          )}
        </section>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t border-border bg-card px-8 py-4">
        <div className="text-sm text-muted-foreground">
          {step === 1 && mode === "pr" && (
            <span>
              <strong className="text-foreground">Total items:</strong> 54{" "}
              <span className="ml-3">
                <strong className="text-foreground">Total consolidations:</strong> 2
              </span>{" "}
              <span className="ml-3">
                <strong className="text-foreground">Categories:</strong> 3
              </span>{" "}
              <span className="ml-3">
                <strong className="text-foreground">Total value:</strong> $77,000
              </span>
            </span>
          )}
          {step === 1 && mode === "direct" && (
            <DirectSummary items={directItems} scopeType={scopeType} />
          )}
          {step === 2 && mode === "pr" && (
            <span>
              <strong className="text-foreground">Total items:</strong> 54{" "}
              <span className="ml-3">
                <strong className="text-foreground">Total value:</strong> $77,000
              </span>{" "}
              <span className="ml-3">
                <strong className="text-foreground">Categories:</strong> 3
              </span>
            </span>
          )}
          {step === 2 && mode === "direct" && (
            <DirectSummary items={directItems} scopeType={scopeType} />
          )}
        </div>
        <div className="flex items-center gap-4">
          {step > 0 && (
            <button onClick={onBack} className="text-sm font-semibold text-foreground hover:underline">
              Back
            </button>
          )}
          <Link to="/" className="text-sm font-semibold text-foreground hover:underline">
            Cancel
          </Link>
          <button
            onClick={onNext}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90"
          >
            {nextLabel}
          </button>
        </div>
      </footer>
    </div>
  );
}

/* ---------------- Step 0: Basic Details ---------------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-foreground">{label}</label>
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent ${props.className ?? ""}`}
    />
  );
}

function SelectInput({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-border bg-background px-3 py-2 pr-9 text-sm text-foreground outline-none focus:border-accent"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function DateInput({ value }: { value: string }) {
  return (
    <div className="relative">
      <input
        defaultValue={value}
        className="w-full rounded-md border border-border bg-background px-3 py-2 pr-9 text-sm text-foreground outline-none focus:border-accent"
      />
      <Calendar className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-bold text-foreground">{title}</h2>
      {children}
    </div>
  );
}

function BasicDetails({
  scopeType,
  onScopeTypeChange,
}: {
  scopeType: ScopeType;
  onScopeTypeChange: (t: ScopeType) => void;
}) {
  const [name, setName] = useState("Steel Materials");
  const [type, setType] = useState("RFP");
  const [cat, setCat] = useState("Equipment");

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <Card title="Event Details">
        <div className="space-y-4">
          <Field label="Event name">
            <TextInput value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Event type">
            <SelectInput value={type} onChange={setType} options={["RFP", "RFQ", "RFI"]} />
          </Field>
          <Field label="Event category">
            <SelectInput value={cat} onChange={setCat} options={["Equipment", "Materials", "Supplier"]} />
          </Field>
          <Field label="Scope type">
            <ScopeTypeSegmented value={scopeType} onChange={onScopeTypeChange} />
          </Field>
          <Field label="Timeline">
            <DateInput value="Feb 23, 2027" />
          </Field>
          <div className="grid grid-cols-[1fr_120px] gap-3">
            <Field label="Estimated value">
              <TextInput defaultValue="500" />
            </Field>
            <Field label="Currency">
              <SelectInput value="USD" onChange={() => {}} options={["USD", "EUR", "INR"]} />
            </Field>
          </div>
        </div>
      </Card>

      <Card title="Timeline">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Event open date"><DateInput value="Feb 23, 2027" /></Field>
          <Field label="Q&A Window Close"><DateInput value="Feb 23, 2027" /></Field>
          <Field label="Submission Deadline"><DateInput value="Feb 23, 2027" /></Field>
          <Field label="Evaluation Deadline"><DateInput value="Feb 23, 2027" /></Field>
          <Field label="Award Date"><DateInput value="Feb 23, 2027" /></Field>
          <Field label="Contract Start Date"><DateInput value="Feb 23, 2027" /></Field>
        </div>
      </Card>

      <Card title="Description">
        <textarea
          placeholder="Brief description of what you are sourcing..."
          rows={4}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
        />
      </Card>
    </div>
  );
}

/* ---------------- Step 1: Select PR's & Consolidate ---------------- */

const CONSOLIDATIONS = [
  {
    id: "c1",
    name: "Q2 MRO Replenishment",
    description: "Quarterly MRO and spares replenishment consolidation across all plants. Aligned to maintenance schedule.",
    added: true,
    ai: false,
  },
  {
    id: "c2",
    name: "Equipment Bundle",
    description: "Groups all urgent pipe and fitting PRs across plants for faster market coverage and lead-time reduction.",
    added: false,
    ai: false,
  },
  {
    id: "c3",
    name: "Equipment Bundle",
    description: "Groups all urgent pipe and fitting PRs across plants for faster market coverage and lead-time reduction.",
    added: true,
    ai: false,
  },
  {
    id: "c4",
    name: "Steel Bundle (AI-Suggested)",
    description: "Combines all stainless steel material classes into one sourcing event to leverage volume discounts from SS specialists.",
    added: true,
    ai: true,
  },
];

type PRRow = {
  id: number;
  material: string;
  category: "Materials" | "Equipment" | "Safety";
  urgency: "Low" | "Medium" | "High";
  value: number;
  added?: boolean;
};

const PR_TEMPLATE: Omit<PRRow, "id">[] = [
  { material: "Carbon Steel Sheets (1000 units)", category: "Materials", urgency: "Low", value: 85500, added: true },
  { material: "Stainless Steel Rods (500 units)", category: "Equipment", urgency: "Low", value: 37000, added: true },
  { material: "Assembly Equipment", category: "Safety", urgency: "Medium", value: 1940000 },
  { material: "Safety Helmets (200 units)", category: "Equipment", urgency: "High", value: 192000 },
];

const PR_ROWS: PRRow[] = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  ...PR_TEMPLATE[i % PR_TEMPLATE.length],
}));

function UrgencyBadge({ u }: { u: PRRow["urgency"] }) {
  const map = {
    Low: "bg-[oklch(0.6_0.18_250)] text-white",
    Medium: "bg-[oklch(0.74_0.16_65)] text-white",
    High: "bg-[oklch(0.6_0.22_25)] text-white",
  } as const;
  return <span className={`inline-block min-w-[60px] rounded-full px-3 py-1 text-center text-xs font-semibold ${map[u]}`}>{u}</span>;
}

function FilterPill({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
      {label}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}

function ConsolidationMiniCard({
  c,
  selected,
  onClick,
}: {
  c: (typeof CONSOLIDATIONS)[number];
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`flex flex-col rounded-xl border bg-card p-5 shadow-sm ${
        selected ? "border-[oklch(0.62_0.16_155)] ring-1 ring-[oklch(0.62_0.16_155)]" : "border-border"
      }`}
    >
      <h4 className="text-sm font-bold text-foreground">{c.name}</h4>
      <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">{c.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Urgent", "Cross-Plant", "Pipes & Fittings"].map((t) => (
          <span key={t} className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-foreground">$46,399</span>
          <span className="text-muted-foreground">28 PRs</span>
        </div>
        {c.added ? (
          <span className="rounded-md bg-[oklch(0.62_0.16_155)]/15 px-2.5 py-1 text-xs font-semibold text-[oklch(0.45_0.14_155)]">
            ✓ Added
          </span>
        ) : (
          <button
            onClick={onClick}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
          >
            <Plus className="h-3 w-3" />
            Use in Sourcing Event
          </button>
        )}
      </div>
    </div>
  );
}

function SelectAndConsolidate() {
  const [added, setAdded] = useState<Set<number>>(new Set([0, 1]));
  const [selRows, setSelRows] = useState<Set<number>>(new Set([0, 1, 2]));
  const [page, setPage] = useState(1);
  const pageSize = 28;
  const rows = PR_ROWS.slice(0, pageSize);

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-foreground">Consolidations</h2>
        <button className="inline-flex items-center gap-2 rounded-md bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent hover:bg-accent/20">
          <Plus className="h-4 w-4" />
          Add new
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {CONSOLIDATIONS.map((c) => (
          <ConsolidationMiniCard key={c.id} c={c} selected={c.ai} onClick={() => {}} />
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-base font-bold text-foreground">Unconsolidated purchase requisitions</h2>
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <button className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
            Add selected to Consolidation...
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <FilterPill label="All Materials" />
            <FilterPill label="All categories" />
            <FilterPill label="All plants" />
            <FilterPill label="All prices" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                <th className="w-10 px-4 py-3"></th>
                <th className="px-4 py-3 font-semibold text-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    Material <ArrowUpDown className="h-3.5 w-3.5" />
                  </span>
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">Category</th>
                <th className="px-4 py-3 font-semibold text-foreground">Urgency</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Est. value</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const isAdded = r.added || added.has(r.id);
                const isSel = selRows.has(r.id);
                return (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          const n = new Set(selRows);
                          if (n.has(r.id)) n.delete(r.id);
                          else n.add(r.id);
                          setSelRows(n);
                        }}
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          isSel ? "border-accent bg-accent text-accent-foreground" : "border-border bg-background"
                        }`}
                      >
                        {isSel && <Check className="h-3 w-3" strokeWidth={3} />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-foreground">{r.material}</td>
                    <td className="px-4 py-3 text-foreground">{r.category}</td>
                    <td className="px-4 py-3"><UrgencyBadge u={r.urgency} /></td>
                    <td className="px-4 py-3 text-right text-foreground">${r.value.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      {isAdded ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[oklch(0.62_0.16_155)]/15 px-2.5 py-1 text-xs font-semibold text-[oklch(0.45_0.14_155)]">
                          <Check className="h-3 w-3" /> Added
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            const n = new Set(added);
                            n.add(r.id);
                            setAdded(n);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          <Plus className="h-3 w-3" /> Add to sourcing event
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-1 border-t border-border px-4 py-3 text-sm">
          <ChevronsLeft className="h-4 w-4 text-muted-foreground" />
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-md text-xs font-medium ${
                p === page ? "bg-accent/10 text-accent" : "text-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <ChevronsRight className="h-4 w-4 text-muted-foreground" />
          <div className="ml-2 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs">
            10 <ChevronDown className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Step 2: Review ---------------- */

const REVIEW_TEMPLATE = [
  { name: "Carbon Steel Sheets (1000 units)", qty: 1005, urgency: "Low" as const, value: 85500 },
  { name: "Stainless Steel Rods (500 units)", qty: 694, urgency: "Low" as const, value: 37000 },
  { name: "Assembly Equipment", qty: 64, urgency: "Medium" as const, value: 1940000 },
  { name: "Safety Helmets (200 units)", qty: 9, urgency: "High" as const, value: 192000 },
  { name: "Carbon Steel Sheets (1000 units)", qty: 859, urgency: "Low" as const, value: 85500 },
  { name: "Stainless Steel Rods (500 units)", qty: 5, urgency: "Low" as const, value: 37000 },
  { name: "Assembly Equipment", qty: 17, urgency: "Medium" as const, value: 1940000 },
  { name: "Safety Helmets (200 units)", qty: 63, urgency: "High" as const, value: 192000 },
];

function ReviewStep({
  mode,
  scopeType,
  directItems,
}: {
  mode: SourcingMode;
  scopeType: ScopeType;
  directItems: DirectItem[];
}) {
  const [page, setPage] = useState(1);
  const [removed, setRemoved] = useState<Set<number>>(new Set());
  const rows = useMemo(
    () => Array.from({ length: 28 }, (_, i) => ({ id: i, ...REVIEW_TEMPLATE[i % REVIEW_TEMPLATE.length] })),
    [],
  );
  const visible = rows.filter((r) => !removed.has(r.id));

  if (mode === "direct") {
    return <DirectReview items={directItems} scopeType={scopeType} />;
  }


  return (
    <div className="mx-auto max-w-6xl">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
              <th className="px-4 py-3 font-semibold text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  Items <ArrowUpDown className="h-3.5 w-3.5" />
                </span>
              </th>
              <th className="px-4 py-3 font-semibold text-foreground">Quantity</th>
              <th className="px-4 py-3 font-semibold text-foreground">Urgency</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Est. value</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                <td className="px-4 py-2.5 text-foreground">{r.name}</td>
                <td className="px-4 py-2.5">
                  <div className="relative">
                    <input
                      defaultValue={r.qty}
                      className="w-32 rounded-md border border-border bg-background px-2.5 py-1.5 pr-7 text-sm outline-none focus:border-accent"
                    />
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </td>
                <td className="px-4 py-2.5"><UrgencyBadge u={r.urgency} /></td>
                <td className="px-4 py-2.5 text-right text-foreground">${r.value.toLocaleString()}</td>
                <td className="px-4 py-2.5">
                  <button
                    onClick={() => {
                      const n = new Set(removed);
                      n.add(r.id);
                      setRemoved(n);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-center gap-1 border-t border-border px-4 py-3 text-sm">
          <ChevronsLeft className="h-4 w-4 text-muted-foreground" />
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-8 w-8 rounded-md text-xs font-medium ${
                p === page ? "bg-accent/10 text-accent" : "text-foreground hover:bg-muted"
              }`}
            >
              {p}
            </button>
          ))}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <ChevronsRight className="h-4 w-4 text-muted-foreground" />
          <div className="ml-2 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs">
            10 <ChevronDown className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Scope type control ---------------- */

function ScopeTypeSegmented({
  value,
  onChange,
}: {
  value: ScopeType;
  onChange: (v: ScopeType) => void;
}) {
  const opts: { id: ScopeType; label: string; hint: string }[] = [
    { id: "goods", label: "Goods", hint: "Physical items, qty × price" },
    { id: "services", label: "Services", hint: "SOW, T&M, or retainer" },
    { id: "mixed", label: "Mixed", hint: "Equipment + install + services" },
    { id: "framework", label: "Framework", hint: "Agreed rates, no qty" },
  ];
  return (
    <div role="radiogroup" aria-label="Scope type" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {opts.map((o) => {
        const selected = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.id)}
            className={`flex flex-col items-start rounded-lg border px-3 py-2.5 text-left transition ${
              selected
                ? "border-accent bg-accent/5 ring-2 ring-accent/30"
                : "border-border bg-background hover:border-accent/40 hover:bg-muted/40"
            }`}
          >
            <span className="text-sm font-semibold text-foreground">{o.label}</span>
            <span className="mt-0.5 text-[11px] text-muted-foreground">{o.hint}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Step 2 wrapper: Mode chooser + branched content ---------------- */

function SourcingScopeStep({
  mode,
  onModeChange,
  scopeType,
  directItems,
  onDirectItemsChange,
}: {
  mode: SourcingMode;
  onModeChange: (m: SourcingMode) => void;
  scopeType: ScopeType;
  directItems: DirectItem[];
  onDirectItemsChange: (items: DirectItem[]) => void;
}) {
  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-foreground">How do you want to source?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick the path that fits this event. You can switch modes any time before submitting.
        </p>
      </div>
      <ModeChooser mode={mode} onChange={onModeChange} scopeType={scopeType} />
      <div className="mt-8">
        {mode === "pr" ? (
          <SelectAndConsolidate />
        ) : (
          <DirectSourcingItems
            items={directItems}
            onChange={onDirectItemsChange}
            scopeType={scopeType}
          />
        )}
      </div>
    </div>
  );
}

function ModeChooser({
  mode,
  onChange,
  scopeType,
}: {
  mode: SourcingMode;
  onChange: (m: SourcingMode) => void;
  scopeType: ScopeType;
}) {
  const prDimmed = scopeType === "services" || scopeType === "framework";
  const options: {
    id: SourcingMode;
    title: string;
    desc: string;
    hint: string;
    icon: React.ReactNode;
    dimmed?: boolean;
  }[] = [
    {
      id: "pr",
      title: "PR-based / Consolidation",
      desc: "Build the event from open purchase requisitions. Group related PRs into bundles for better leverage.",
      hint: prDimmed ? "Goods PRs only — selectable if your org requisitions services" : "Recommended when PRs exist",
      icon: <Layers className="h-5 w-5" />,
      dimmed: prDimmed,
    },
    {
      id: "direct",
      title: "Direct Sourcing",
      desc: "Source items directly, without linking to existing PRs. Best for one-off buys, pilots, or strategic deals.",
      hint: "No PRs required",
      icon: <Package className="h-5 w-5" />,
    },
  ];

  return (
    <div role="radiogroup" aria-label="Sourcing mode" className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {options.map((o) => {
        const selected = mode === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(o.id)}
            className={`group relative flex flex-col items-start rounded-xl border bg-card p-5 text-left shadow-sm transition ${
              selected
                ? "border-accent ring-2 ring-accent/30"
                : "border-border hover:border-accent/40 hover:bg-muted/30"
            } ${o.dimmed && !selected ? "opacity-60" : ""}`}
          >
            <div className="flex w-full items-start justify-between gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  selected ? "bg-accent text-accent-foreground" : "bg-muted text-foreground"
                }`}
              >
                {o.icon}
              </div>
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  selected ? "border-accent bg-accent" : "border-border bg-background"
                }`}
                aria-hidden
              >
                {selected && <Check className="h-3 w-3 text-accent-foreground" strokeWidth={3} />}
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">{o.title}</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">{o.desc}</p>
            <span className="mt-4 inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              {o.hint}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Direct Sourcing line items (polymorphic) ---------------- */

type ItemKind = "good" | "service" | "framework";
type ServiceEngagement = "fixed" | "tm" | "retainer";

type GoodItem = {
  id: number;
  kind: "good";
  name: string;
  description?: string;
  category: string;
  qty: number;
  uom: string;
  plant: string;
  unitPrice: number;
  notes?: string;
};

type ServiceFixed = {
  id: number;
  kind: "service";
  engagement: "fixed";
  name: string;
  description?: string;
  category: string;
  plant: string;
  deliverables: string;
  startDate: string;
  endDate: string;
  fixedPrice: number;
  notes?: string;
};

type ServiceTM = {
  id: number;
  kind: "service";
  engagement: "tm";
  name: string;
  description?: string;
  category: string;
  plant: string;
  role: string;
  rate: number;
  rateUnit: "hr" | "day";
  effort: number;
  notes?: string;
};

type ServiceRetainer = {
  id: number;
  kind: "service";
  engagement: "retainer";
  name: string;
  description?: string;
  category: string;
  plant: string;
  monthlyFee: number;
  durationMonths: number;
  notes?: string;
};

type ServiceItem = ServiceFixed | ServiceTM | ServiceRetainer;

type FrameworkItem = {
  id: number;
  kind: "framework";
  name: string;
  description?: string;
  category: string;
  rate: number;
  rateUnit: string;
  annualVolume?: number;
  notes?: string;
};

type DirectItem = GoodItem | ServiceItem | FrameworkItem;

const CATEGORY_OPTIONS = ["Equipment", "Materials", "Services", "Consumables"];
const UOM_OPTIONS = ["units", "kg", "tonnes", "meters", "hours", "boxes"];
const PLANT_OPTIONS = ["Plant 19 — Boston", "Plant 04 — Dallas", "Plant 11 — Newark", "HQ Warehouse"];
const RATE_UNIT_OPTIONS = ["hr", "day", "month", "unit"];

const KIND_LABEL: Record<ItemKind, string> = {
  good: "Good",
  service: "Service",
  framework: "Framework",
};

function itemValue(i: DirectItem): number {
  switch (i.kind) {
    case "good":
      return i.qty * i.unitPrice;
    case "service":
      if (i.engagement === "fixed") return i.fixedPrice;
      if (i.engagement === "tm") return i.rate * i.effort;
      return i.monthlyFee * i.durationMonths;
    case "framework":
      return (i.annualVolume ?? 0) * i.rate;
  }
}

function itemSubLabel(i: DirectItem): string {
  switch (i.kind) {
    case "good":
      return `${i.qty.toLocaleString()} ${i.uom} × $${i.unitPrice.toLocaleString()}`;
    case "service":
      if (i.engagement === "fixed") return `Fixed-price SOW · ${i.startDate || "—"} → ${i.endDate || "—"}`;
      if (i.engagement === "tm") return `T&M · ${i.role || "Role"} · ${i.effort} ${i.rateUnit} × $${i.rate.toLocaleString()}/${i.rateUnit}`;
      return `Retainer · $${i.monthlyFee.toLocaleString()}/mo × ${i.durationMonths} mo`;
    case "framework":
      return `Framework · $${i.rate.toLocaleString()}/${i.rateUnit}${
        i.annualVolume ? ` × ${i.annualVolume.toLocaleString()} (est.)` : " · no volume"
      }`;
  }
}

const SAMPLE_DIRECT_ITEMS: DirectItem[] = [
  {
    id: 1,
    kind: "good",
    name: "Industrial air compressor (100HP)",
    description: "Rotary-screw, oil-free, with integrated dryer.",
    category: "Equipment",
    qty: 2,
    uom: "units",
    plant: "Plant 19 — Boston",
    unitPrice: 18500,
    notes: "Service contract for 3 years preferred.",
  },
  {
    id: 2,
    kind: "good",
    name: "PPE bundle — annual replenishment",
    description: "Helmets, gloves, hi-vis vests, safety boots.",
    category: "Consumables",
    qty: 1200,
    uom: "units",
    plant: "HQ Warehouse",
    unitPrice: 42,
  },
  {
    id: 3,
    kind: "service",
    engagement: "tm",
    name: "Compressor installation & commissioning",
    category: "Services",
    plant: "Plant 19 — Boston",
    role: "Senior mechanical engineer",
    rate: 180,
    rateUnit: "hr",
    effort: 120,
    notes: "Includes pipework + safety sign-off.",
  },
  {
    id: 4,
    kind: "framework",
    name: "Spare parts catalog rates (Q2–Q4)",
    category: "Materials",
    rate: 1,
    rateUnit: "unit",
    annualVolume: 8500,
    notes: "Catalog pricing, draw down against PRs.",
  },
];

function emptyForKind(kind: ItemKind, id: number, scopeType: ScopeType): DirectItem {
  const base = {
    id,
    name: "",
    description: "",
    notes: "",
  };
  if (kind === "good") {
    return {
      ...base,
      kind: "good",
      category: scopeType === "services" ? "Services" : CATEGORY_OPTIONS[0],
      qty: 1,
      uom: UOM_OPTIONS[0],
      plant: PLANT_OPTIONS[0],
      unitPrice: 0,
    };
  }
  if (kind === "framework") {
    return {
      ...base,
      kind: "framework",
      category: CATEGORY_OPTIONS[0],
      rate: 0,
      rateUnit: "hr",
      annualVolume: undefined,
    };
  }
  // service default to fixed
  return {
    ...base,
    kind: "service",
    engagement: "fixed",
    category: "Services",
    plant: PLANT_OPTIONS[0],
    deliverables: "",
    startDate: "",
    endDate: "",
    fixedPrice: 0,
  };
}

function allowedKinds(scopeType: ScopeType): ItemKind[] {
  switch (scopeType) {
    case "goods":
      return ["good"];
    case "services":
      return ["service"];
    case "framework":
      return ["framework"];
    case "mixed":
      return ["good", "service", "framework"];
  }
}

function DirectSourcingItems({
  items,
  onChange,
  scopeType,
}: {
  items: DirectItem[];
  onChange: (items: DirectItem[]) => void;
  scopeType: ScopeType;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [editing, setEditing] = useState<DirectItem | { kind: ItemKind; isNew: true } | null>(null);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const total = items.reduce((s, i) => s + itemValue(i), 0);
  const kinds = allowedKinds(scopeType);
  const isMixed = scopeType === "mixed";
  const nextId = () => (items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1);

  function startAdd(kind: ItemKind) {
    setAddMenuOpen(false);
    setEditing({ kind, isNew: true });
  }

  function importStub() {
    const start = nextId();
    const sample: DirectItem[] = [
      {
        id: start,
        kind: "good",
        name: "Imported — Lubricant drums (55 gal)",
        category: "Consumables",
        qty: 40,
        uom: "units",
        plant: "Plant 04 — Dallas",
        unitPrice: 320,
      },
      {
        id: start + 1,
        kind: "service",
        engagement: "fixed",
        name: "Imported — Annual calibration service",
        category: "Services",
        plant: "Plant 11 — Newark",
        deliverables: "All measurement equipment calibrated and certified.",
        startDate: "Apr 1, 2026",
        endDate: "Apr 30, 2026",
        fixedPrice: 24000,
      },
    ];
    onChange([...items, ...sample]);
  }

  function saveItem(item: DirectItem) {
    if (items.find((i) => i.id === item.id)) {
      onChange(items.map((i) => (i.id === item.id ? item : i)));
    } else {
      onChange([...items, item]);
    }
  }

  function deleteSelected() {
    onChange(items.filter((i) => !selected.has(i.id)));
    setSelected(new Set());
  }

  function deleteOne(id: number) {
    onChange(items.filter((i) => i.id !== id));
  }

  const breakdown = useMemo(() => {
    const acc: Record<ItemKind, { count: number; value: number }> = {
      good: { count: 0, value: 0 },
      service: { count: 0, value: 0 },
      framework: { count: 0, value: 0 },
    };
    items.forEach((i) => {
      acc[i.kind].count += 1;
      acc[i.kind].value += itemValue(i);
    });
    return acc;
  }, [items]);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-foreground">Sourcing line items</h2>
          <p className="text-xs text-muted-foreground">
            {scopeType === "mixed"
              ? "Add goods, services, and framework rates in one event."
              : `Add ${scopeType === "framework" ? "framework rates" : scopeType} this event will source.`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={importStub}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Upload className="h-4 w-4" /> Import from CSV
          </button>
          <button
            onClick={() => alert("CSV template download (stub)")}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
          >
            <FileDown className="h-4 w-4" /> Template
          </button>
          {isMixed ? (
            <div className="relative">
              <button
                onClick={() => setAddMenuOpen((o) => !o)}
                className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground hover:opacity-90"
              >
                <Plus className="h-4 w-4" /> Add
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              {addMenuOpen && (
                <div
                  className="absolute right-0 z-20 mt-1.5 w-56 overflow-hidden rounded-md border border-border bg-card shadow-lg"
                  onMouseLeave={() => setAddMenuOpen(false)}
                >
                  {(["good", "service", "framework"] as ItemKind[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => startAdd(k)}
                      className="block w-full px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted"
                    >
                      <span className="font-medium">{KIND_LABEL[k]}</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        {k === "good"
                          ? "Qty × unit price"
                          : k === "service"
                            ? "SOW · T&M · Retainer"
                            : "Agreed rate"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => startAdd(kinds[0])}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-semibold text-accent-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" />{" "}
              {scopeType === "services"
                ? "Add service"
                : scopeType === "framework"
                  ? "Add framework rate"
                  : "Add line item"}
            </button>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Package className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-bold text-foreground">No line items yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Add the items, services, or scope you want suppliers to bid on.
          </p>
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => startAdd(kinds[0])}
              className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
            >
              <Plus className="h-4 w-4" /> Add line item
            </button>
            <button
              onClick={importStub}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Upload className="h-4 w-4" /> Import from CSV
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {selected.size > 0 && (
            <div className="flex items-center justify-between border-b border-border bg-accent/5 px-4 py-2.5">
              <span className="text-sm font-medium text-foreground">{selected.size} selected</span>
              <button
                onClick={deleteSelected}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-destructive hover:bg-destructive/5"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      aria-label="Select all"
                      checked={selected.size === items.length}
                      onChange={(e) =>
                        setSelected(e.target.checked ? new Set(items.map((i) => i.id)) : new Set())
                      }
                      className="h-4 w-4 rounded border-border"
                    />
                  </th>
                  {isMixed && <th className="px-4 py-3 font-semibold text-foreground">Type</th>}
                  <th className="px-4 py-3 font-semibold text-foreground">Item</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Category</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Details</th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">Est. value</th>
                  <th className="w-20 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => {
                  const isSel = selected.has(r.id);
                  const value = itemValue(r);
                  const isIndicative = r.kind === "framework" && !r.annualVolume;
                  return (
                    <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => {
                            const n = new Set(selected);
                            if (n.has(r.id)) n.delete(r.id);
                            else n.add(r.id);
                            setSelected(n);
                          }}
                          className="h-4 w-4 rounded border-border"
                        />
                      </td>
                      {isMixed && (
                        <td className="px-4 py-3">
                          <KindPill kind={r.kind} />
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">{r.name || "—"}</div>
                        {r.description && (
                          <div className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                            {r.description}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-foreground">{r.category}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{itemSubLabel(r)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="font-semibold text-foreground">${value.toLocaleString()}</div>
                        {isIndicative && (
                          <div className="text-[10px] text-muted-foreground">indicative — no volume</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => setEditing(r)}
                            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteOne(r.id)}
                            className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-muted/20">
                  <td colSpan={isMixed ? 5 : 4} className="px-4 py-3 text-sm text-muted-foreground">
                    {isMixed && (
                      <span>
                        Goods{" "}
                        <strong className="text-foreground">${breakdown.good.value.toLocaleString()}</strong>
                        <span className="mx-2 text-border">·</span>
                        Services{" "}
                        <strong className="text-foreground">
                          ${breakdown.service.value.toLocaleString()}
                        </strong>
                        <span className="mx-2 text-border">·</span>
                        Framework{" "}
                        <strong className="text-foreground">
                          ${breakdown.framework.value.toLocaleString()}
                        </strong>
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-foreground">
                    ${total.toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {editing !== null && (
        <DirectItemModal
          initial={"isNew" in editing ? null : editing}
          newKind={"isNew" in editing ? editing.kind : (editing as DirectItem).kind}
          nextId={nextId()}
          scopeType={scopeType}
          onClose={() => setEditing(null)}
          onSave={(item, addAnother) => {
            saveItem(item);
            if (addAnother) setEditing({ kind: item.kind, isNew: true });
            else setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function KindPill({ kind }: { kind: ItemKind }) {
  const cls =
    kind === "good"
      ? "bg-blue-500/10 text-blue-600"
      : kind === "service"
        ? "bg-purple-500/10 text-purple-600"
        : "bg-amber-500/10 text-amber-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${cls}`}>
      {KIND_LABEL[kind]}
    </span>
  );
}

function DirectItemModal({
  initial,
  newKind,
  nextId,
  scopeType,
  onClose,
  onSave,
}: {
  initial: DirectItem | null;
  newKind: ItemKind;
  nextId: number;
  scopeType: ScopeType;
  onClose: () => void;
  onSave: (item: DirectItem, addAnother: boolean) => void;
}) {
  const [form, setForm] = useState<DirectItem>(initial ?? emptyForKind(newKind, nextId, scopeType));

  function patch(p: Partial<DirectItem>) {
    setForm((f) => ({ ...f, ...p }) as DirectItem);
  }

  function submit(addAnother: boolean) {
    if (!form.name.trim()) return;
    onSave(form, addAnother);
  }

  function changeEngagement(engagement: ServiceEngagement) {
    if (form.kind !== "service") return;
    const base = {
      id: form.id,
      kind: "service" as const,
      name: form.name,
      description: form.description,
      category: form.category,
      plant: form.plant,
      notes: form.notes,
    };
    if (engagement === "fixed") {
      setForm({ ...base, engagement: "fixed", deliverables: "", startDate: "", endDate: "", fixedPrice: 0 });
    } else if (engagement === "tm") {
      setForm({ ...base, engagement: "tm", role: "", rate: 0, rateUnit: "hr", effort: 0 });
    } else {
      setForm({ ...base, engagement: "retainer", monthlyFee: 0, durationMonths: 0 });
    }
  }

  const title = initial ? `Edit ${KIND_LABEL[form.kind].toLowerCase()}` : `Add ${KIND_LABEL[form.kind].toLowerCase()}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4">
      <div className="w-full max-w-xl rounded-xl bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {/* Common name/description */}
          <Field label={form.kind === "good" ? "Item name" : form.kind === "service" ? "Service name" : "Rate name"}>
            <TextInput value={form.name} onChange={(e) => patch({ name: e.target.value })} placeholder="e.g. Industrial air compressor" />
          </Field>
          <Field label="Description">
            <textarea
              value={form.description ?? ""}
              onChange={(e) => patch({ description: e.target.value })}
              rows={2}
              placeholder="Optional"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <SelectInput value={form.category} onChange={(v) => patch({ category: v })} options={CATEGORY_OPTIONS} />
            </Field>
            {form.kind !== "framework" && (
              <Field label="Plant / Destination">
                <SelectInput
                  value={form.plant}
                  onChange={(v) => patch({ plant: v })}
                  options={PLANT_OPTIONS}
                />
              </Field>
            )}
          </div>

          {/* Kind-specific fields */}
          {form.kind === "good" && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Quantity">
                <TextInput type="number" value={form.qty} onChange={(e) => patch({ qty: Number(e.target.value) } as Partial<GoodItem>)} />
              </Field>
              <Field label="UoM">
                <SelectInput value={form.uom} onChange={(v) => patch({ uom: v } as Partial<GoodItem>)} options={UOM_OPTIONS} />
              </Field>
              <Field label="Target unit price (USD)">
                <TextInput type="number" value={form.unitPrice} onChange={(e) => patch({ unitPrice: Number(e.target.value) } as Partial<GoodItem>)} />
              </Field>
              <Field label="Estimated value">
                <ReadOnlyValue value={itemValue(form)} />
              </Field>
            </div>
          )}

          {form.kind === "service" && (
            <>
              <Field label="Engagement model">
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: "fixed", label: "Fixed-price SOW" },
                      { id: "tm", label: "Time & Materials" },
                      { id: "retainer", label: "Recurring / Retainer" },
                    ] as { id: ServiceEngagement; label: string }[]
                  ).map((e) => {
                    const selected = form.engagement === e.id;
                    return (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => changeEngagement(e.id)}
                        className={`rounded-md border px-3 py-2 text-xs font-semibold transition ${
                          selected
                            ? "border-accent bg-accent/5 text-foreground ring-2 ring-accent/30"
                            : "border-border bg-background text-foreground hover:bg-muted"
                        }`}
                      >
                        {e.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {form.engagement === "fixed" && (
                <>
                  <Field label="Deliverables">
                    <textarea
                      value={form.deliverables}
                      onChange={(e) => patch({ deliverables: e.target.value } as Partial<ServiceFixed>)}
                      rows={2}
                      placeholder="Key deliverables and acceptance criteria"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Start date">
                      <TextInput value={form.startDate} onChange={(e) => patch({ startDate: e.target.value } as Partial<ServiceFixed>)} placeholder="e.g. Apr 1, 2026" />
                    </Field>
                    <Field label="End date">
                      <TextInput value={form.endDate} onChange={(e) => patch({ endDate: e.target.value } as Partial<ServiceFixed>)} placeholder="e.g. Jun 30, 2026" />
                    </Field>
                    <Field label="Fixed price (USD)">
                      <TextInput type="number" value={form.fixedPrice} onChange={(e) => patch({ fixedPrice: Number(e.target.value) } as Partial<ServiceFixed>)} />
                    </Field>
                    <Field label="Estimated value">
                      <ReadOnlyValue value={itemValue(form)} />
                    </Field>
                  </div>
                </>
              )}

              {form.engagement === "tm" && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Role / Skill">
                    <TextInput value={form.role} onChange={(e) => patch({ role: e.target.value } as Partial<ServiceTM>)} placeholder="e.g. Senior mechanical engineer" />
                  </Field>
                  <Field label="Rate unit">
                    <SelectInput
                      value={form.rateUnit}
                      onChange={(v) => patch({ rateUnit: v as ServiceTM["rateUnit"] } as Partial<ServiceTM>)}
                      options={["hr", "day"]}
                    />
                  </Field>
                  <Field label="Rate (USD)">
                    <TextInput type="number" value={form.rate} onChange={(e) => patch({ rate: Number(e.target.value) } as Partial<ServiceTM>)} />
                  </Field>
                  <Field label="Estimated effort">
                    <TextInput type="number" value={form.effort} onChange={(e) => patch({ effort: Number(e.target.value) } as Partial<ServiceTM>)} />
                  </Field>
                  <Field label="Estimated value">
                    <ReadOnlyValue value={itemValue(form)} />
                  </Field>
                </div>
              )}

              {form.engagement === "retainer" && (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Monthly fee (USD)">
                    <TextInput type="number" value={form.monthlyFee} onChange={(e) => patch({ monthlyFee: Number(e.target.value) } as Partial<ServiceRetainer>)} />
                  </Field>
                  <Field label="Duration (months)">
                    <TextInput type="number" value={form.durationMonths} onChange={(e) => patch({ durationMonths: Number(e.target.value) } as Partial<ServiceRetainer>)} />
                  </Field>
                  <Field label="Estimated value">
                    <ReadOnlyValue value={itemValue(form)} />
                  </Field>
                </div>
              )}
            </>
          )}

          {form.kind === "framework" && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Agreed rate (USD)">
                <TextInput type="number" value={form.rate} onChange={(e) => patch({ rate: Number(e.target.value) } as Partial<FrameworkItem>)} />
              </Field>
              <Field label="Rate unit">
                <SelectInput value={form.rateUnit} onChange={(v) => patch({ rateUnit: v } as Partial<FrameworkItem>)} options={RATE_UNIT_OPTIONS} />
              </Field>
              <Field label="Estimated annual volume (optional)">
                <TextInput
                  type="number"
                  value={form.annualVolume ?? ""}
                  onChange={(e) =>
                    patch({
                      annualVolume: e.target.value === "" ? undefined : Number(e.target.value),
                    } as Partial<FrameworkItem>)
                  }
                />
              </Field>
              <Field label="Estimated value">
                <ReadOnlyValue value={itemValue(form)} />
              </Field>
            </div>
          )}

          <Field label="Notes">
            <textarea
              value={form.notes ?? ""}
              onChange={(e) => patch({ notes: e.target.value })}
              rows={2}
              placeholder="Optional notes for suppliers"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
          <button onClick={onClose} className="rounded-md px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted">
            Cancel
          </button>
          {!initial && (
            <button
              onClick={() => submit(true)}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Save & add another
            </button>
          )}
          <button
            onClick={() => submit(false)}
            className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground hover:opacity-90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function ReadOnlyValue({ value }: { value: number }) {
  return (
    <div className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm font-semibold text-foreground">
      ${value.toLocaleString()}
    </div>
  );
}

function DirectSummary({ items, scopeType }: { items: DirectItem[]; scopeType: ScopeType }) {
  const total = items.reduce((s, i) => s + itemValue(i), 0);
  if (scopeType === "mixed") {
    const goods = items.filter((i) => i.kind === "good").reduce((s, i) => s + itemValue(i), 0);
    const services = items.filter((i) => i.kind === "service").reduce((s, i) => s + itemValue(i), 0);
    const framework = items.filter((i) => i.kind === "framework").reduce((s, i) => s + itemValue(i), 0);
    return (
      <span>
        <strong className="text-foreground">Lines:</strong> {items.length}
        <span className="ml-3">
          Goods <strong className="text-foreground">${goods.toLocaleString()}</strong>
        </span>
        <span className="ml-3">
          Services <strong className="text-foreground">${services.toLocaleString()}</strong>
        </span>
        <span className="ml-3">
          Framework <strong className="text-foreground">${framework.toLocaleString()}</strong>
        </span>
        <span className="ml-3">
          <strong className="text-foreground">Total:</strong> ${total.toLocaleString()}
        </span>
      </span>
    );
  }
  return (
    <span>
      <strong className="text-foreground">Lines:</strong> {items.length}
      <span className="ml-3">
        <strong className="text-foreground">Scope:</strong> {SCOPE_TYPE_LABEL[scopeType]}
      </span>{" "}
      <span className="ml-3">
        <strong className="text-foreground">Total value:</strong> ${total.toLocaleString()}
      </span>
    </span>
  );
}

function DirectReview({ items, scopeType }: { items: DirectItem[]; scopeType: ScopeType }) {
  const goods = items.filter((i): i is GoodItem => i.kind === "good");
  const services = items.filter((i): i is ServiceItem => i.kind === "service");
  const framework = items.filter((i): i is FrameworkItem => i.kind === "framework");
  const total = items.reduce((s, i) => s + itemValue(i), 0);
  const isMixed = scopeType === "mixed";

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
          <Package className="h-3.5 w-3.5" /> Direct Sourcing · {SCOPE_TYPE_LABEL[scopeType]}
        </span>
        <span className="text-sm text-muted-foreground">No PRs linked to this event.</span>
      </div>

      {(isMixed ? goods.length > 0 : goods.length > 0) && (
        <ReviewSection title="Goods" count={goods.length}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                <th className="px-4 py-3 font-semibold text-foreground">Item</th>
                <th className="px-4 py-3 font-semibold text-foreground">Category</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Qty</th>
                <th className="px-4 py-3 font-semibold text-foreground">Plant</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Unit price</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Est. value</th>
              </tr>
            </thead>
            <tbody>
              {goods.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-foreground">{r.name}</div>
                    {r.description && <div className="text-xs text-muted-foreground line-clamp-1">{r.description}</div>}
                  </td>
                  <td className="px-4 py-2.5 text-foreground">{r.category}</td>
                  <td className="px-4 py-2.5 text-right text-foreground">{r.qty.toLocaleString()} {r.uom}</td>
                  <td className="px-4 py-2.5 text-foreground">{r.plant}</td>
                  <td className="px-4 py-2.5 text-right text-foreground">${r.unitPrice.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-foreground">${itemValue(r).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReviewSection>
      )}

      {services.length > 0 && (
        <ReviewSection title="Services" count={services.length}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                <th className="px-4 py-3 font-semibold text-foreground">Service</th>
                <th className="px-4 py-3 font-semibold text-foreground">Engagement</th>
                <th className="px-4 py-3 font-semibold text-foreground">Details</th>
                <th className="px-4 py-3 font-semibold text-foreground">Plant</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Est. value</th>
              </tr>
            </thead>
            <tbody>
              {services.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-foreground">{r.name}</div>
                    {r.description && <div className="text-xs text-muted-foreground line-clamp-1">{r.description}</div>}
                  </td>
                  <td className="px-4 py-2.5 text-foreground">
                    {r.engagement === "fixed" ? "Fixed-price SOW" : r.engagement === "tm" ? "T&M" : "Retainer"}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{itemSubLabel(r)}</td>
                  <td className="px-4 py-2.5 text-foreground">{r.plant}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-foreground">${itemValue(r).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReviewSection>
      )}

      {framework.length > 0 && (
        <ReviewSection title="Framework rates" count={framework.length}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
                <th className="px-4 py-3 font-semibold text-foreground">Item / Role</th>
                <th className="px-4 py-3 font-semibold text-foreground">Category</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Rate</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Est. volume</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Est. value</th>
              </tr>
            </thead>
            <tbody>
              {framework.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5">
                    <div className="font-medium text-foreground">{r.name}</div>
                    {r.description && <div className="text-xs text-muted-foreground line-clamp-1">{r.description}</div>}
                  </td>
                  <td className="px-4 py-2.5 text-foreground">{r.category}</td>
                  <td className="px-4 py-2.5 text-right text-foreground">${r.rate.toLocaleString()}/{r.rateUnit}</td>
                  <td className="px-4 py-2.5 text-right text-foreground">
                    {r.annualVolume ? r.annualVolume.toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold text-foreground">
                    {r.annualVolume ? `$${itemValue(r).toLocaleString()}` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReviewSection>
      )}

      <div className="flex items-center justify-end rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
        <span className="text-sm text-muted-foreground">Total estimated value</span>
        <span className="ml-3 text-lg font-bold text-foreground">${total.toLocaleString()}</span>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <span className="text-xs text-muted-foreground">{count} {count === 1 ? "line" : "lines"}</span>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

