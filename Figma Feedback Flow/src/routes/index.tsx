import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell,
  Database,
  FileText,
  LayoutGrid,
  Layers,
  Menu,
  PencilLine,
  Plus,
  Search,
  Settings,
  Share2,
  Table as TableIcon,
  Wallet,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  X,
  Check,
  ArrowUpDown,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sourcing Hub — Leah Procure" },
      { name: "description", content: "Manage sourcing events, purchase requisitions and consolidations." },
    ],
  }),
  component: SourcingHub,
});

// -------------------- mock data --------------------

type Stage =
  | "Pending approval"
  | "Pending RFP acceptance"
  | "Waiting for award"
  | "RFP declined";

const STAGE_STYLES: Record<Stage, string> = {
  "Pending approval": "bg-[oklch(0.62_0.16_155)] text-white",
  "Pending RFP acceptance": "bg-[oklch(0.6_0.18_250)] text-white",
  "Waiting for award": "bg-[oklch(0.74_0.16_65)] text-white",
  "RFP declined": "bg-[oklch(0.6_0.22_25)] text-white",
};

type PR = {
  id: string;
  code: string;
  name: string;
  l1: string;
  l2: string;
  l3: string;
  category: "Materials" | "Equipment" | "Supplier";
  date: string;
  value: number;
  stage: Stage;
};

const PR_TEMPLATE: Omit<PR, "id" | "date">[] = [
  { code: "ITM-100245", name: "Carbon Steel Sheets (1000 units)", l1: "Raw Materials", l2: "Metals", l3: "Carbon Steel", category: "Materials", value: 85500, stage: "Pending approval" },
  { code: "ITM-100312", name: "Stainless Steel Rods (500 units)", l1: "Raw Materials", l2: "Metals", l3: "SS 304", category: "Equipment", value: 37000, stage: "Pending RFP acceptance" },
  { code: "ITM-200118", name: "Assembly Equipment", l1: "Equipment", l2: "Assembly", l3: "Hydraulic Press", category: "Supplier", value: 1940000, stage: "Waiting for award" },
  { code: "ITM-300087", name: "Safety Helmets (200 units)", l1: "Safety", l2: "PPE", l3: "Helmets", category: "Materials", value: 192000, stage: "RFP declined" },
];

const PRS: PR[] = Array.from({ length: 30 }, (_, i) => {
  const t = PR_TEMPLATE[i % PR_TEMPLATE.length];
  const day = 15 + i;
  return {
    id: `pr-${i}`,
    date: `Apr ${day}, 2026`,
    ...t,
  };
});


type Consolidation = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  value: number;
  prs: number;
  added?: boolean;
  aiSuggested?: boolean;
};

const INITIAL_CONSOLIDATIONS: Consolidation[] = [
  {
    id: "c1",
    name: "Equipment Bundle",
    description: "Groups all urgent pipe and fitting PRs across plants for faster market coverage and lead-time reduction.",
    tags: ["Urgent", "Cross-Plant", "Pipes & Fittings"],
    value: 46399,
    prs: 28,
  },
  {
    id: "c2",
    name: "Steel Bundle (AI-Suggested)",
    description: "Combines all stainless steel material classes into one sourcing event to leverage volume discounts from SS specialists.",
    tags: ["Urgent", "Cross-Plant", "Pipes & Fittings"],
    value: 46399,
    prs: 28,
    added: true,
    aiSuggested: true,
  },
  {
    id: "c3",
    name: "Q2 MRO Replenishment",
    description: "Quarterly MRO and spares replenishment consolidation across all plants. Aligned to maintenance schedule.",
    tags: ["Urgent", "Cross-Plant", "Pipes & Fittings"],
    value: 46399,
    prs: 28,
    added: true,
  },
  {
    id: "c4",
    name: "Plant A Shutdown Prep",
    description: "All materials required for the upcoming Plant A annual shutdown. Urgent timeline — needs award within 10 days.",
    tags: ["Urgent", "Cross-Plant", "Pipes & Fittings"],
    value: 46399,
    prs: 28,
  },
  {
    id: "c5",
    name: "Bengaluru - Plant Hardware",
    description: "All materials required for the upcoming Plant A annual shutdown. Urgent timeline — needs award within 10 days.",
    tags: ["Urgent", "Cross-Plant", "Pipes & Fittings"],
    value: 46399,
    prs: 28,
  },
];

// -------------------- root --------------------

function SourcingHub() {
  const [tab, setTab] = useState<"events" | "prs">("prs");
  const [consolidations, setConsolidations] = useState<Consolidation[]>(INITIAL_CONSOLIDATIONS);
  const [selectedPRs, setSelectedPRs] = useState<Set<string>>(new Set());
  const [pushOpen, setPushOpen] = useState(false);
  const [editConsolidation, setEditConsolidation] = useState<Consolidation | null>(null);
  const [newConsolidation, setNewConsolidation] = useState<{ defaultName: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 px-10 py-8">
        <header className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Sourcing Hub</h1>
          <Link
            to="/sourcing/new"
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Create Sourcing Event
          </Link>
        </header>

        {toast && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-[oklch(0.62_0.16_155)]/30 bg-[oklch(0.62_0.16_155)]/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[oklch(0.62_0.16_155)] text-white">
                <Check className="h-4 w-4" />
              </span>
              <span className="text-sm font-semibold text-foreground">{toast}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>5s</span>
              <button onClick={() => setToast(null)}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <StatsRow />

        <div className="mt-2 border-b border-border">
          <div className="flex">
            <TabButton active={tab === "events"} onClick={() => setTab("events")}>
              Active Sourcing Events
            </TabButton>
            <TabButton active={tab === "prs"} onClick={() => setTab("prs")}>
              Purchase Requisitions and Consolidations
            </TabButton>
          </div>
        </div>

        {tab === "prs" ? (
          <>
            <section className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Consolidations</h2>
                <button
                  className="flex items-center gap-2 rounded-md bg-accent/10 px-3 py-1.5 text-sm font-medium text-accent transition hover:bg-accent/20"
                  onClick={() =>
                    setNewConsolidation({ defaultName: "" })
                  }
                >
                  <Plus className="h-4 w-4" />
                  Add new
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {consolidations.map((c) => (
                  <ConsolidationCard
                    key={c.id}
                    c={c}
                    onUse={() => setEditConsolidation(c)}
                  />
                ))}
              </div>
            </section>

            <section className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-foreground">Purchase requisitions</h2>
              <PRTable
                selectedPRs={selectedPRs}
                setSelectedPRs={setSelectedPRs}
                onPushToConsolidation={() => {
                  if (selectedPRs.size === 0) return;
                  setPushOpen(true);
                }}
                onUseInSourcingEvent={() => {
                  if (selectedPRs.size === 0) return;
                  showToast("Your sourcing event has been created sucessfully!");
                  setSelectedPRs(new Set());
                }}
              />
            </section>
          </>
        ) : (
          <EmptyEvents />
        )}
      </main>

      {pushOpen && (
        <PushToConsolidationModal
          itemCount={selectedPRs.size}
          consolidations={consolidations}
          onClose={() => setPushOpen(false)}
          onConfirm={() => {
            setPushOpen(false);
            setSelectedPRs(new Set());
            showToast("Items pushed to consolidation");
          }}
          onAddNew={() => {
            setPushOpen(false);
            setNewConsolidation({ defaultName: "" });
          }}
        />
      )}

      {editConsolidation && (
        <ConsolidationItemsModal
          title={editConsolidation.name}
          defaultName={editConsolidation.name}
          mode="edit"
          onClose={() => setEditConsolidation(null)}
          onConfirm={() => {
            setEditConsolidation(null);
            showToast("Your sourcing event has been created sucessfully!");
          }}
        />
      )}

      {newConsolidation && (
        <ConsolidationItemsModal
          title="New Consolidation"
          defaultName={newConsolidation.defaultName || "Pipe Consolidation"}
          mode="new"
          onClose={() => setNewConsolidation(null)}
          onConfirm={(name) => {
            setConsolidations((prev) => [
              ...prev,
              {
                id: `c-${Date.now()}`,
                name: name || "New Consolidation",
                description: "Newly created consolidation.",
                tags: ["Urgent", "Cross-Plant", "Pipes & Fittings"],
                value: 46399,
                prs: 28,
              },
            ]);
            setNewConsolidation(null);
            showToast("Consolidation created");
          }}
        />
      )}
    </div>
  );
}

// -------------------- sidebar --------------------

function Sidebar() {
  const icons = [
    { Icon: Menu, label: "Menu" },
    { Icon: PencilLine, label: "Compose" },
    { Icon: LayoutGrid, label: "Dashboard" },
    { Icon: Share2, label: "Share" },
    { Icon: TableIcon, label: "Tables" },
    { Icon: Wallet, label: "Wallet" },
    { Icon: FileText, label: "Sourcing", active: true },
    { Icon: Database, label: "Data" },
  ];
  return (
    <aside className="flex w-16 flex-col items-center border-r border-border bg-sidebar py-4">
      <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-lg font-bold text-primary-foreground">
        A
      </div>
      <nav className="flex flex-1 flex-col items-center gap-2">
        {icons.map(({ Icon, label, active }) => (
          <button
            key={label}
            className={`flex h-10 w-10 items-center justify-center rounded-md transition ${
              active
                ? "bg-primary/10 text-primary"
                : "text-sidebar-foreground/60 hover:bg-sidebar-accent"
            }`}
            title={label}
          >
            <Icon className="h-5 w-5" />
          </button>
        ))}
      </nav>
      <div className="mt-auto flex flex-col items-center gap-3">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            1
          </span>
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-md text-sidebar-foreground/60 hover:bg-sidebar-accent">
          <Settings className="h-5 w-5" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
          JD
        </div>
      </div>
    </aside>
  );
}

// -------------------- stats --------------------

function StatsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Donut
        title="Event status distribution"
        topRight="1"
        segments={[
          { label: "Awarded 4 (45%)", value: 45, color: "oklch(0.6 0.2 250)" },
          { label: "Completed 5 (64%)", value: 30, color: "oklch(0.65 0.18 155)" },
          { label: "Active 1 (7%)", value: 10, color: "oklch(0.74 0.16 65)" },
          { label: "Cancelled 2 (29%)", value: 15, color: "oklch(0.6 0.22 25)" },
        ]}
        centerLabel="40%"
      />
      <Donut
        title="Win rate"
        topRight="4 May, 2026"
        segments={[
          { label: "Won 4 (37%)", value: 37, color: "oklch(0.65 0.18 155)" },
          { label: "Pending 1 (7%)", value: 7, color: "oklch(0.74 0.16 65)" },
          { label: "Lost 6 (56%)", value: 56, color: "oklch(0.6 0.22 25)" },
        ]}
        centerLabel="40%"
      />
      <div className="grid grid-rows-2 gap-4">
        <StatCard label="Total events" value="12" />
        <StatCard label="Active events" value="15" />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-6 py-5 shadow-sm">
      <span className="text-base font-semibold text-foreground">{label}</span>
      <span className="text-2xl font-bold text-foreground">{value}</span>
    </div>
  );
}

function Donut({
  title,
  topRight,
  segments,
  centerLabel,
}: {
  title: string;
  topRight: string;
  segments: { label: string; value: number; color: string }[];
  centerLabel: string;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let acc = 0;
  const r = 38;
  const c = 2 * Math.PI * r;
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span className="text-sm font-semibold text-foreground">{topRight}</span>
      </div>
      <div className="flex items-center gap-5">
        <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 100 100" className="-rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" stroke="oklch(0.94 0.005 270)" strokeWidth="14" />
            {segments.map((s, i) => {
              const len = (s.value / total) * c;
              const el = (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="14"
                  strokeDasharray={`${len} ${c - len}`}
                  strokeDashoffset={-acc}
                />
              );
              acc += len;
              return el;
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-foreground">
            {centerLabel}
          </div>
        </div>
        <ul className="flex-1 space-y-1.5 text-sm">
          {segments.map((s) => (
            <li key={s.label} className="flex items-center gap-2 text-muted-foreground">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
              {s.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// -------------------- tabs --------------------

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium transition ${
        active
          ? "border-accent text-accent"
          : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

// -------------------- consolidation card --------------------

function ConsolidationCard({ c, onUse }: { c: Consolidation; onUse: () => void }) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-base font-bold text-foreground">{c.name}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {c.tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold text-foreground">${c.value.toLocaleString()}</span>
          <span className="text-muted-foreground">{c.prs} PRs</span>
        </div>
        {c.added ? (
          <span className="rounded-md bg-[oklch(0.62_0.16_155)]/15 px-3 py-1.5 text-xs font-semibold text-[oklch(0.45_0.14_155)]">
            Added
          </span>
        ) : (
          <button
            onClick={onUse}
            className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted"
          >
            <Plus className="h-3.5 w-3.5" />
            Use in Sourcing Event
          </button>
        )}
      </div>
    </div>
  );
}

// -------------------- PR table --------------------

function PRTable({
  selectedPRs,
  setSelectedPRs,
  onPushToConsolidation,
  onUseInSourcingEvent,
}: {
  selectedPRs: Set<string>;
  setSelectedPRs: (s: Set<string>) => void;
  onPushToConsolidation: () => void;
  onUseInSourcingEvent: () => void;
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.ceil(PRS.length / pageSize);
  const rows = useMemo(
    () => PRS.slice((page - 1) * pageSize, page * pageSize),
    [page],
  );

  const allSelected = rows.every((r) => selectedPRs.has(r.id));
  function toggleAll() {
    const next = new Set(selectedPRs);
    if (allSelected) rows.forEach((r) => next.delete(r.id));
    else rows.forEach((r) => next.add(r.id));
    setSelectedPRs(next);
  }
  function toggleRow(id: string) {
    const next = new Set(selectedPRs);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedPRs(next);
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <ActionPill onClick={onUseInSourcingEvent} disabled={selectedPRs.size === 0}>
            Use in Sourcing Event
          </ActionPill>
          <ActionPill onClick={onPushToConsolidation} disabled={selectedPRs.size === 0}>
            Push to Consolidation
          </ActionPill>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterPill label="Categories" />
          <FilterPill label="Date created" />
          <FilterPill label="Value" />
          <FilterPill label="Stage" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
              <th className="w-10 px-4 py-3">
                <Checkbox checked={allSelected} onChange={toggleAll} />
              </th>
              <th className="px-4 py-3 font-semibold text-foreground">Item Code</th>
              <th className="px-4 py-3 font-semibold text-foreground">
                <span className="inline-flex items-center gap-1.5">
                  Name <ArrowUpDown className="h-3.5 w-3.5" />
                </span>
              </th>
              <th className="px-4 py-3 font-semibold text-foreground">Category</th>
              <th className="px-4 py-3 font-semibold text-foreground">Date created</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Est. value</th>
              <th className="px-4 py-3 font-semibold text-foreground">Stage</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                <td className="px-4 py-3">
                  <Checkbox checked={selectedPRs.has(r.id)} onChange={() => toggleRow(r.id)} />
                </td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{r.code}</td>
                <td className="px-4 py-3 text-foreground">{r.name}</td>
                <td className="px-4 py-3"><CategoryPath l1={r.l1} l2={r.l2} l3={r.l3} /></td>
                <td className="px-4 py-3 text-foreground">{r.date}</td>
                <td className="px-4 py-3 text-right text-foreground">
                  ${r.value.toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <StageBadge stage={r.stage} />
                </td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

function ActionPill({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
    >
      {children}
    </button>
  );
}

function FilterPill({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted">
      {label}
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}

function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${STAGE_STYLES[stage]}`}>
      {stage}
    </span>
  );
}

function Checkbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`flex h-4 w-4 items-center justify-center rounded border transition ${
        checked
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-background hover:border-accent"
      }`}
    >
      {checked && <Check className="h-3 w-3" strokeWidth={3} />}
    </button>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1 border-t border-border px-4 py-3 text-sm">
      <IconBtn onClick={() => onChange(1)} disabled={page === 1}>
        <ChevronsLeft className="h-4 w-4" />
      </IconBtn>
      <IconBtn onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}>
        <ChevronLeft className="h-4 w-4" />
      </IconBtn>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`h-8 w-8 rounded-md text-xs font-medium transition ${
            p === page
              ? "bg-accent/10 text-accent"
              : "text-foreground hover:bg-muted"
          }`}
        >
          {p}
        </button>
      ))}
      <IconBtn onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}>
        <ChevronRight className="h-4 w-4" />
      </IconBtn>
      <IconBtn onClick={() => onChange(totalPages)} disabled={page === totalPages}>
        <ChevronsRight className="h-4 w-4" />
      </IconBtn>
      <div className="ml-2 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs">
        10 <ChevronDown className="h-3 w-3" />
      </div>
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-md text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}

// -------------------- modals --------------------

function ModalShell({
  children,
  onClose,
  maxWidth = "max-w-xl",
}: {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 px-4">
      <div className={`w-full ${maxWidth} rounded-xl bg-card shadow-2xl`}>
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-muted-foreground hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

function PushToConsolidationModal({
  itemCount,
  consolidations,
  onClose,
  onConfirm,
  onAddNew,
}: {
  itemCount: number;
  consolidations: Consolidation[];
  onClose: () => void;
  onConfirm: () => void;
  onAddNew: () => void;
}) {
  const [added, setAdded] = useState<Set<string>>(new Set());
  const list = consolidations.slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 px-4">
      <div className="relative w-full max-w-3xl rounded-xl bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-bold text-foreground">
            Adding {itemCount} items to consolidation
          </h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          {list.map((c) => {
            const isAdded = added.has(c.id);
            return (
              <div key={c.id} className="flex flex-col rounded-lg border border-border p-4">
                <h4 className="text-sm font-bold text-foreground">{c.name}</h4>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-3">{c.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span key={t} className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-foreground">${c.value.toLocaleString()}</span>
                    <span className="text-muted-foreground">{c.prs} PRs</span>
                  </div>
                  <button
                    onClick={() => {
                      const next = new Set(added);
                      if (next.has(c.id)) next.delete(c.id);
                      else next.add(c.id);
                      setAdded(next);
                    }}
                    className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                      isAdded
                        ? "bg-[oklch(0.62_0.16_155)]/15 text-[oklch(0.45_0.14_155)]"
                        : "border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {isAdded ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                    {isAdded ? "Added" : "Add"}
                  </button>
                </div>
              </div>
            );
          })}
          <button
            onClick={onAddNew}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-sm font-medium text-muted-foreground transition hover:border-accent hover:text-accent md:col-span-2"
          >
            <Plus className="h-5 w-5" />
            Add line items to a new consolidation
          </button>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button onClick={onClose} className="text-sm font-semibold text-foreground hover:underline">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Confirm Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function ConsolidationItemsModal({
  title,
  defaultName,
  mode,
  onClose,
  onConfirm,
}: {
  title: string;
  defaultName: string;
  mode: "edit" | "new";
  onClose: () => void;
  onConfirm: (name: string) => void;
}) {
  const [name, setName] = useState(defaultName);
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState<Set<number>>(new Set([0, 3, 4, 6]));
  const [page, setPage] = useState(1);

  const allItems = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        name: 'SS 304 Seamless Pipe 2"',
        meta: "PR-2026-1142 · Plant A",
        value: 68400,
      })),
    [],
  );
  const filtered = allItems.filter((it) =>
    it.name.toLowerCase().includes(search.toLowerCase()),
  );
  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const rows = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 px-4">
      <div className="relative w-full max-w-2xl rounded-xl bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-foreground">
              Consolidation name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">Line Items</span>
              <button className="inline-flex items-center gap-1 text-sm text-foreground hover:text-accent">
                All items <ChevronDown className="h-4 w-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search..."
                className="w-full rounded-md border border-border bg-background py-2 pl-10 pr-3 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto rounded-md">
            {rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                <Layers className="h-10 w-10 text-muted-foreground" />
                <div>
                  <p className="font-semibold text-foreground">No Line Items Found</p>
                  <p className="text-sm text-muted-foreground">
                    Try loosening up your search query.
                  </p>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {rows.map((it) => {
                  const isAdded = added.has(it.id);
                  return (
                    <li key={it.id} className="flex items-center justify-between py-2.5">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{it.name}</p>
                        <p className="text-xs text-muted-foreground">{it.meta}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-foreground">
                          ₹{it.value.toLocaleString()}
                        </span>
                        <button
                          onClick={() => {
                            const next = new Set(added);
                            if (next.has(it.id)) next.delete(it.id);
                            else next.add(it.id);
                            setAdded(next);
                          }}
                          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition ${
                            isAdded
                              ? "bg-[oklch(0.62_0.16_155)]/15 text-[oklch(0.45_0.14_155)]"
                              : "border border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          {isAdded ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                          {isAdded ? "Added" : "Add"}
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {filtered.length > 0 && (
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Any changes you make here apply only to this sourcing event
          </p>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-sm font-semibold text-foreground hover:underline">
              Cancel
            </button>
            <button
              onClick={() => onConfirm(name)}
              disabled={added.size === 0}
              className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {mode === "new" ? "Confirm Changes" : "Use in Sourcing Event"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------- empty events --------------------

function EmptyEvents() {
  return <SourcingEventsTable />;
}

// -------------------- shared helpers --------------------

function CategoryPath({ l1, l2, l3 }: { l1: string; l2: string; l3: string }) {
  return (
    <span className="text-xs text-foreground">
      <span className="font-medium">{l1}</span>
      <span className="mx-1 text-muted-foreground/60">›</span>
      <span className="text-muted-foreground">{l2}</span>
      <span className="mx-1 text-muted-foreground/60">›</span>
      <span className="text-muted-foreground">{l3}</span>
    </span>
  );
}

function SupplierLink({ name }: { name: string }) {
  return (
    <a
      href="#"
      role="link"
      onClick={(e) => e.preventDefault()}
      className="cursor-pointer font-medium text-accent underline-offset-2 hover:underline"
    >
      {name}
    </a>
  );
}

// -------------------- active sourcing events table --------------------

type SourcingEvent = {
  id: string;       // e.g. SO011445
  name: string;
  routeId?: string; // optional link target
  source: "PR Consolidation" | "Contract Renewal" | "Intake Request";
  l1: string; l2: string; l3: string;
  suppliersInvited: number;
  supplierInitials: string;
  supplierColor: string;
  value: number;
  status: "Open RFP" | "Awarded" | "Evaluating" | "Rejected";
};

const SOURCING_EVENTS: SourcingEvent[] = [
  { id: "SO011445", name: "SS Pipe Consolidated RFP", routeId: "steel-materials-q2", source: "PR Consolidation", l1: "Raw Materials", l2: "Metals", l3: "SS 304", suppliersInvited: 7, supplierInitials: "JD", supplierColor: "oklch(0.6 0.18 250)", value: 85500, status: "Open RFP" },
  { id: "SO011446", name: "Valve Supply Renewal 2026", source: "Contract Renewal", l1: "Equipment", l2: "Flow Control", l3: "Industrial Valves", suppliersInvited: 3, supplierInitials: "TM", supplierColor: "oklch(0.62 0.16 155)", value: 37000, status: "Awarded" },
  { id: "SO011447", name: "Boiler Tubes & CS Fittings", source: "PR Consolidation", l1: "Raw Materials", l2: "Metals", l3: "Carbon Steel", suppliersInvited: 2, supplierInitials: "HE", supplierColor: "oklch(0.6 0.22 25)", value: 1940000, status: "Open RFP" },
  { id: "SO011448", name: "Spare Parts Q2 Procurement", source: "Intake Request", l1: "MRO", l2: "Spares", l3: "Plant Hardware", suppliersInvited: 3, supplierInitials: "PO", supplierColor: "oklch(0.74 0.16 65)", value: 192000, status: "Awarded" },
  { id: "SO011449", name: "Networking Equipment Tender — Q1 2027", source: "PR Consolidation", l1: "IT", l2: "Networking", l3: "Switches & Routers", suppliersInvited: 5, supplierInitials: "CV", supplierColor: "oklch(0.55 0.2 290)", value: 45000, status: "Open RFP" },
  { id: "SO011450", name: "Mobile Devices RFQ — Q3 2026", source: "PR Consolidation", l1: "IT", l2: "Hardware", l3: "Mobile Devices", suppliersInvited: 6, supplierInitials: "HP", supplierColor: "oklch(0.6 0.18 250)", value: 340120, status: "Evaluating" },
  { id: "SO011451", name: "Data Center Infrastructure RFQ — Q2 2026", source: "Contract Renewal", l1: "IT", l2: "Infrastructure", l3: "Server Racks", suppliersInvited: 1, supplierInitials: "HP", supplierColor: "oklch(0.62 0.16 155)", value: 97000, status: "Rejected" },
  { id: "SO011452", name: "Security Systems RFQ — Q4 2026", source: "Contract Renewal", l1: "Facilities", l2: "Security", l3: "Access Control", suppliersInvited: 2, supplierInitials: "QW", supplierColor: "oklch(0.74 0.16 65)", value: 1200500, status: "Evaluating" },
];

const EVENT_STATUS_STYLES: Record<SourcingEvent["status"], string> = {
  "Open RFP": "bg-[oklch(0.55_0.2_290)] text-white",
  "Awarded": "bg-[oklch(0.62_0.16_155)] text-white",
  "Evaluating": "bg-[oklch(0.74_0.16_65)] text-white",
  "Rejected": "bg-[oklch(0.6_0.22_25)] text-white",
};

function SourcingEventsTable() {
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(SOURCING_EVENTS.length / pageSize));
  const rows = SOURCING_EVENTS.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Sourcing events</h2>
        <div className="flex flex-wrap items-center gap-2">
          <FilterPill label="Categories" />
          <FilterPill label="Date created" />
          <FilterPill label="Value" />
          <FilterPill label="Stage" />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
              <th className="px-4 py-3 font-semibold text-foreground">
                <span className="inline-flex items-center gap-1.5">Event / ID <ArrowUpDown className="h-3.5 w-3.5" /></span>
              </th>
              <th className="px-4 py-3 font-semibold text-foreground">Source</th>
              <th className="px-4 py-3 font-semibold text-foreground">Category</th>
              <th className="px-4 py-3 font-semibold text-foreground">Suppliers</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Value</th>
              <th className="px-4 py-3 font-semibold text-foreground">Status</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((ev) => {
              const NameCell = ev.routeId ? (
                <Link
                  to="/events/$id"
                  params={{ id: ev.routeId }}
                  className="font-medium text-foreground hover:text-accent"
                >
                  {ev.name}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{ev.name}</span>
              );
              return (
                <tr key={ev.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      {NameCell}
                      <span className="font-mono text-[11px] text-muted-foreground">{ev.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-foreground">{ev.source}</td>
                  <td className="px-4 py-3"><CategoryPath l1={ev.l1} l2={ev.l2} l3={ev.l3} /></td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold text-white"
                        style={{ backgroundColor: ev.supplierColor }}
                      >
                        {ev.supplierInitials}
                      </span>
                      <span className="text-foreground">+{ev.suppliersInvited} Invited</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-foreground">${ev.value.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${EVENT_STATUS_STYLES[ev.status]}`}>
                      {ev.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">⋮</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </section>
  );
}

