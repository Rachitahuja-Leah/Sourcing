import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  PencilLine,
  Eye,
  X,
  ChevronDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Check,
  Clock,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  List,
  ListChecks,
  Indent,
  Outdent,
  Type,
  Highlighter,
  Eraser,
  Link2,
  Paperclip,
  Sparkles,
  Plus,
  MoreVertical,
  FileText,
  CircleCheck,
  Search,
  UserPlus,
  FilePlus2,
  GitCompare,
  AlertCircle,
  Diamond,
  Upload,
  ClipboardCheck,
  MessageSquareText,
  Award,
  Send,
  Lock,
  CheckCircle2,
  ShoppingCart,
  FileSignature,
  Scale,
  Split,
  DollarSign,
  Trash2,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { JourneyDrawer, DEFAULT_PROCUREMENT_STAGES, type JourneyStage } from "@/components/JourneyDrawer";

export const Route = createFileRoute("/events/$id")({
  head: () => ({
    meta: [
      { title: "Steel Materials Q2 — Sourcing Hub" },
      { name: "description", content: "Sourcing event detail, line items, approvals, RFP and vendors." },
    ],
  }),
  component: EventDetail,
});

type Tab = "overview" | "line-items" | "approvals" | "builder" | "vendors";
type BuilderStage = "in-progress" | "draft-ready" | "published";

function EventDetail() {
  const [tab, setTab] = useState<Tab>("overview");
  // shared builder state so top bar reflects current stage button
  const [builderStage, setBuilderStage] = useState<BuilderStage>("in-progress");
  // when published, the build steps are collapsed by default; user can reopen
  const [showBuildDetails, setShowBuildDetails] = useState(false);
  const [journeyOpen, setJourneyOpen] = useState(false);

  const isPublished = builderStage === "published";
  const showBuilderUI = !isPublished || showBuildDetails;

  const topButton =
    builderStage === "in-progress"
      ? { label: "Create RFP", icon: <ArrowRight className="ml-1 h-4 w-4" /> }
      : builderStage === "draft-ready"
        ? { label: "Submit for Approval", icon: null }
        : { label: "Publish RFP", icon: null };

  // demo: current stage = "Invite Suppliers" (index 1). Mark step 0 complete.
  const journeyStages: JourneyStage[] = DEFAULT_PROCUREMENT_STAGES.map((s, i) => {
    if (i === 0) return { ...s, status: "complete" };
    if (i === 1)
      return {
        ...s,
        status: "current",
        action: { label: "Invite Suppliers", onClick: () => { setJourneyOpen(false); setTab("vendors"); } },
      };
    return s;
  });

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1">
        {/* top bar */}
        <header className="flex items-center justify-between border-b border-border bg-card px-8 py-5">
          <div className="flex items-center gap-2 text-lg">
            <Link to="/" className="font-bold text-muted-foreground hover:text-foreground">
              Sourcing Hub
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-bold text-foreground">Steel Materials Q2</span>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>Stage: <span className="font-semibold text-foreground">{isPublished ? "RFP Published" : "RFP Creation"}</span></span>
              <StageDots active={2} total={5} />
              <button
                onClick={() => setJourneyOpen(true)}
                className="text-sm font-medium text-accent underline underline-offset-2 hover:opacity-80"
              >
                See all stages
              </button>
            </div>
            <button className="inline-flex items-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90">
              {topButton.label}{topButton.icon}
            </button>
          </div>
        </header>

        <div className="px-8 py-6">
          {/* summary cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <SummaryCard label="Sourcing Type" value="RFQ" sub="Materials" />
            <SummaryCard label="Estimated Value" value="$56,289" sub="67 Line Items" />
            <SummaryCard label="Submission Deadline" value="Feb 23" sub="Not Open Yet" />
            <SummaryCard label="Owner" value="Saul Goodman" sub="Procurement" />
          </div>

          {/* tabs */}
          <div className="mt-6 border-b border-border">
            <div className="flex">
              <DTab active={tab === "overview"} onClick={() => setTab("overview")}>Overview</DTab>
              <DTab active={tab === "line-items"} onClick={() => setTab("line-items")}>Line Items</DTab>
              <DTab active={tab === "approvals"} onClick={() => setTab("approvals")}>Approvals</DTab>
              <DTab active={tab === "builder"} onClick={() => setTab("builder")}>RFP</DTab>
              <DTab active={tab === "vendors"} onClick={() => setTab("vendors")}>{builderStage === "published" ? "Vendors" : "Suppliers"}</DTab>
            </div>
          </div>

          <div className="mt-6 pb-24">
            {tab === "overview" && <OverviewTab />}
            {tab === "line-items" && <LineItemsTab />}
            {tab === "approvals" && <ApprovalsTab />}
            {tab === "builder" && (
              <BuilderTab
                stage={builderStage}
                setStage={setBuilderStage}
                showBuildDetails={showBuildDetails}
                setShowBuildDetails={setShowBuildDetails}
              />
            )}
            {tab === "vendors" && <VendorsTab />}
          </div>
        </div>

        {/* sticky bottom action bar for builder — hide when published preview is collapsed */}
        {tab === "builder" && showBuilderUI && (
          <div className="sticky bottom-0 z-10 flex justify-end border-t border-border bg-card px-8 py-3">
            {builderStage === "in-progress" && (
              <button disabled className="cursor-not-allowed rounded-md bg-primary/10 px-5 py-2 text-sm font-semibold text-primary/50">
                Publish Event
              </button>
            )}
            {builderStage === "draft-ready" && (
              <button disabled className="cursor-not-allowed rounded-md bg-primary/10 px-5 py-2 text-sm font-semibold text-primary/50">
                Publish Event
              </button>
            )}
            {builderStage === "published" && (
              <button className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90">
                Publish <span className="text-xs font-normal opacity-80">RFP</span>
              </button>
            )}
          </div>
        )}
      </main>
      <JourneyDrawer open={journeyOpen} onClose={() => setJourneyOpen(false)} stages={journeyStages} />
    </div>
  );
}

/* shared */

function StageDots({ active, total }: { active: number; total: number }) {
  return (
    <span className="inline-flex items-center gap-1">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-2 w-2 rounded-full ${
            i < active
              ? "bg-foreground"
              : i === active
                ? "bg-primary ring-2 ring-primary/30"
                : "bg-border"
          }`}
        />
      ))}
    </span>
  );
}

function SummaryCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-2xl font-bold text-foreground">{value}</div>
      <div className="mt-3 text-sm text-muted-foreground">{sub}</div>
    </div>
  );
}

function DTab({
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
      className={`flex-1 border-b-2 px-4 py-3 text-sm font-semibold transition ${
        active ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

/* ---------------- Overview ---------------- */

type OverviewModal = null | "data" | "timeline" | "description" | "activity";

function OverviewTab() {
  const [modal, setModal] = useState<OverviewModal>(null);
  const [name, setName] = useState("Steel Materials");
  const [desc, setDesc] = useState(
    "Every prompt. Every file. Every fix. It flows through infrastructure you don't control, improving systems they want to use to replace you.",
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <PanelCard
        title="Event data"
        action={<EditBtn onClick={() => setModal("data")} />}
      >
        <Row label="Name" value={name} />
        <Row label="Type" value="RFP" />
        <Row label="Total value" value="$56,289" />
        <Row label="Category" value="Materials" />
        <Row label="Value" value="$27,500" />
        <Row label="Reviewed by" value="Oswald Whyte" last />
      </PanelCard>

      <PanelCard title="Event timeline" action={<EditBtn onClick={() => setModal("timeline")} />}>
        <Row label="Open date" value="Feb 23, 2027" />
        <Row label="Q&A window close" value="Feb 23, 2027" />
        <Row label="Submission deadline" value="Feb 23, 2027" />
        <Row label="Evaluation deadline" value="Feb 23, 2027" />
        <Row label="Award date" value="Feb 23, 2027" />
        <Row label="Contract start date" value="Feb 23, 2027" last />
      </PanelCard>

      <PanelCard title="Event description" action={<EditBtn onClick={() => setModal("description")} />}>
        <p className="text-sm text-foreground">{desc}</p>
      </PanelCard>

      <PanelCard
        title="Activity"
        action={
          <button
            onClick={() => setModal("activity")}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <Eye className="h-3.5 w-3.5" /> View all
          </button>
        }
      >
        <ActivityList rows={4} />
      </PanelCard>

      {modal === "data" && (
        <EventDataModal name={name} setName={setName} onClose={() => setModal(null)} />
      )}
      {modal === "timeline" && <EventTimelineModal onClose={() => setModal(null)} />}
      {modal === "description" && (
        <EventDescriptionModal value={desc} setValue={setDesc} onClose={() => setModal(null)} />
      )}
      {modal === "activity" && <ActivityDrawer onClose={() => setModal(null)} />}
    </div>
  );
}

function PanelCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        {action}
      </div>
      <div>{children}</div>
    </div>
  );
}

function EditBtn({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
    >
      <PencilLine className="h-3.5 w-3.5" /> Edit
    </button>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2.5 ${last ? "" : "border-b border-dashed border-border"}`}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function ActivityList({ rows }: { rows: number }) {
  const items = Array.from({ length: rows }, (_, i) =>
    i % 2 === 0
      ? { when: "2h ago", what: "Event created by you" }
      : { when: "3d ago", what: "All approval received by 3 approvers" },
  );
  return (
    <ul>
      {items.map((it, i) => (
        <li key={i} className={`flex items-center justify-between py-2 ${i === items.length - 1 ? "" : "border-b border-dashed border-border"}`}>
          <span className="text-sm text-muted-foreground">{it.when}</span>
          <span className="text-sm text-foreground">{it.what}</span>
        </li>
      ))}
    </ul>
  );
}

/* modals */

function ModalShell({ children, onClose, width = "max-w-xl" }: { children: React.ReactNode; onClose: () => void; width?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 px-4">
      <div className={`relative w-full ${width} rounded-xl bg-card shadow-2xl`}>
        <button onClick={onClose} className="absolute right-5 top-5 text-muted-foreground hover:text-foreground">
          <X className="h-5 w-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

function EventDataModal({
  name,
  setName,
  onClose,
}: {
  name: string;
  setName: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose}>
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-bold text-foreground">Event data</h3>
      </div>
      <div className="space-y-4 px-6 py-5">
        <Field label="Event name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </Field>
        <Field label="Event type">
          <SelectField value="RFP" options={["RFP", "RFQ", "RFI"]} />
        </Field>
        <Field label="Event category">
          <SelectField value="Equipment" options={["Equipment", "Materials"]} />
        </Field>
        <Field label="Timeline">
          <SelectField value="Feb 23, 2027" options={["Feb 23, 2027"]} />
        </Field>
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <Field label="Estimated value">
            <input
              defaultValue="500"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </Field>
          <Field label="Currency">
            <SelectField value="USD" options={["USD", "EUR"]} />
          </Field>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 border-t border-border px-6 py-4">
        <button onClick={onClose} className="text-sm font-semibold text-foreground hover:underline">Cancel</button>
        <button onClick={onClose} className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Save Changes
        </button>
      </div>
    </ModalShell>
  );
}

function EventTimelineModal({ onClose }: { onClose: () => void }) {
  const dates = [
    ["Event open date", "Q&A Window Close"],
    ["Submission Deadline", "Evaluation Deadline"],
    ["Award Date", "Contract Start Date"],
  ];
  return (
    <ModalShell onClose={onClose} width="max-w-2xl">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-bold text-foreground">Event timeline</h3>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 px-6 py-5">
        {dates.flat().map((label) => (
          <Field key={label} label={label}>
            <input
              defaultValue="Feb 23, 2027"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </Field>
        ))}
      </div>
      <div className="flex items-center justify-end gap-4 border-t border-border px-6 py-4">
        <button onClick={onClose} className="text-sm font-semibold text-foreground hover:underline">Cancel</button>
        <button onClick={onClose} className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Save Changes
        </button>
      </div>
    </ModalShell>
  );
}

function EventDescriptionModal({
  value,
  setValue,
  onClose,
}: {
  value: string;
  setValue: (v: string) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState(value);
  return (
    <ModalShell onClose={onClose} width="max-w-2xl">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-bold text-foreground">Event description</h3>
      </div>
      <div className="px-6 py-5">
        <textarea
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          rows={5}
          className="w-full rounded-md border-2 border-accent bg-background px-3 py-2 text-sm outline-none"
        />
      </div>
      <div className="flex items-center justify-end gap-4 border-t border-border px-6 py-4">
        <button onClick={onClose} className="text-sm font-semibold text-foreground hover:underline">Cancel</button>
        <button
          onClick={() => {
            setValue(local);
            onClose();
          }}
          className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Save Changes
        </button>
      </div>
    </ModalShell>
  );
}

function ActivityDrawer({ onClose }: { onClose: () => void }) {
  const items = Array.from({ length: 14 }, (_, i) =>
    i % 2 === 0
      ? { when: "2h ago", what: "Event created by you" }
      : { when: "3d ago", what: "All approval received by 3 approvers" },
  );
  return (
    <div className="fixed inset-0 z-50 flex bg-foreground/30">
      <div className="flex-1" onClick={onClose} />
      <div className="flex h-full w-full max-w-2xl flex-col bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h3 className="text-xl font-bold text-foreground">All Procurment Activity</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center justify-end gap-3 border-b border-border px-6 py-4">
          <SelectField value="Last 7 days" options={["Last 7 days", "Last 30 days"]} small />
          <SelectField value="All types" options={["All types"]} small />
        </div>
        <ul className="flex-1 overflow-y-auto px-6 py-2">
          {items.map((it, i) => (
            <li
              key={i}
              className={`flex items-center justify-between py-3 ${i === items.length - 1 ? "" : "border-b border-dashed border-border"}`}
            >
              <span className="text-sm text-muted-foreground">{it.when}</span>
              <span className="text-sm text-foreground">{it.what}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-foreground">{label}</label>
      {children}
    </div>
  );
}

function SelectField({
  value,
  options,
  small,
}: {
  value: string;
  options: string[];
  small?: boolean;
}) {
  return (
    <div className="relative">
      <select
        defaultValue={value}
        className={`appearance-none rounded-md border border-border bg-background pr-9 text-sm outline-none focus:border-accent ${
          small ? "px-3 py-1.5" : "w-full px-3 py-2"
        }`}
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}

/* ---------------- Line Items tab ---------------- */

const LINE_TEMPLATE = [
  { code: "ITM-100245", name: "Carbon Steel Sheets (1000 units)", l1: "Raw Materials", l2: "Metals", l3: "Carbon Steel", qty: 1005, unit: 85500, urgency: "Low" as const },
  { code: "ITM-100312", name: "Stainless Steel Rods (500 units)", l1: "Raw Materials", l2: "Metals", l3: "SS 304", qty: 694, unit: 37000, urgency: "Low" as const },
  { code: "ITM-200118", name: "Assembly Equipment", l1: "Equipment", l2: "Assembly", l3: "Hydraulic Press", qty: 64, unit: 1940000, urgency: "Medium" as const },
  { code: "ITM-300087", name: "Safety Helmets (200 units)", l1: "Safety", l2: "PPE", l3: "Helmets", qty: 9, unit: 192000, urgency: "High" as const },
  { code: "ITM-100246", name: "Carbon Steel Sheets (1000 units)", l1: "Raw Materials", l2: "Metals", l3: "Carbon Steel", qty: 859, unit: 85500, urgency: "Low" as const },
  { code: "ITM-100313", name: "Stainless Steel Rods (500 units)", l1: "Raw Materials", l2: "Metals", l3: "SS 304", qty: 5, unit: 37000, urgency: "Low" as const },
  { code: "ITM-200119", name: "Assembly Equipment", l1: "Equipment", l2: "Assembly", l3: "Hydraulic Press", qty: 17, unit: 1940000, urgency: "Medium" as const },
  { code: "ITM-300088", name: "Safety Helmets (200 units)", l1: "Safety", l2: "PPE", l3: "Helmets", qty: 63, unit: 192000, urgency: "High" as const },
];


function LineItemsTab() {
  const [page, setPage] = useState(1);
  const rows = useMemo(
    () => Array.from({ length: 28 }, (_, i) => ({ id: i, ...LINE_TEMPLATE[i % LINE_TEMPLATE.length] })),
    [],
  );

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <BigStat label="Total items" value="32" />
        <BigStat label="Total value" value="$1,489,699" />
        <BigStat label="Categories" value="1" />
        <BigStat label="Locations" value="3" />
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
              <th className="px-4 py-3 font-semibold text-foreground">Item Code</th>
              <th className="px-4 py-3 font-semibold text-foreground">
                <span className="inline-flex items-center gap-1.5">Items <ArrowUpDown className="h-3.5 w-3.5" /></span>
              </th>
              <th className="px-4 py-3 font-semibold text-foreground">Category</th>
              <th className="px-4 py-3 font-semibold text-foreground">Quantity</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Unit price</th>
              <th className="px-4 py-3 text-right font-semibold text-foreground">Est. value</th>
              <th className="px-4 py-3 font-semibold text-foreground">Urgency</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.code}</td>
                <td className="px-4 py-2.5 text-foreground">{r.name}</td>
                <td className="px-4 py-2.5"><CategoryPath l1={r.l1} l2={r.l2} l3={r.l3} /></td>
                <td className="px-4 py-2.5">
                  <div className="relative">
                    <input
                      defaultValue={r.qty}
                      className="w-32 rounded-md border border-border bg-background px-2.5 py-1.5 pr-7 text-sm outline-none focus:border-accent"
                    />
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </td>
                <td className="px-4 py-2.5 text-right text-foreground">${r.unit.toLocaleString()}</td>
                <td className="px-4 py-2.5 text-right text-foreground">${r.unit.toLocaleString()}</td>
                <td className="px-4 py-2.5"><UrgencyBadge u={r.urgency} /></td>
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
              className={`h-8 w-8 rounded-md text-xs font-medium ${p === page ? "bg-accent/10 text-accent" : "text-foreground hover:bg-muted"}`}
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

function BigStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-xl font-bold text-foreground">{value}</span>
    </div>
  );
}

function UrgencyBadge({ u }: { u: "Low" | "Medium" | "High" }) {
  const map = {
    Low: "bg-[oklch(0.6_0.18_250)] text-white",
    Medium: "bg-[oklch(0.74_0.16_65)] text-white",
    High: "bg-[oklch(0.6_0.22_25)] text-white",
  } as const;
  return <span className={`inline-block min-w-[60px] rounded-full px-3 py-1 text-center text-xs font-semibold ${map[u]}`}>{u}</span>;
}

/* ---------------- Approvals tab ---------------- */

type Status = "Approved" | "Rejected" | "Pending";
const STATUS_COLOR: Record<Status, string> = {
  Approved: "text-[oklch(0.55_0.16_155)]",
  Rejected: "text-[oklch(0.55_0.22_25)]",
  Pending: "text-[oklch(0.55_0.16_65)]",
};

function ApprovalsTab() {
  return (
    <div className="space-y-8">
      <ApprovalGroup
        title="Procurement Approval"
        rows={[
          { name: "Rajesh Kamath", role: "Category manager", status: "Approved", email: "rajesh@kamath.com" },
          { name: "Rajesh Kamath", role: "Category manager", status: "Approved", email: "rajesh@kamath.com" },
          { name: "Rajesh Kamath", role: "Category manager", status: "Rejected", email: "rajesh@kamath.com" },
        ]}
      />
      <ApprovalGroup
        title="Finance Approval"
        rows={[
          { name: "Rajesh Kamath", role: "Category manager", status: "Pending", email: "rajesh@kamath.com" },
          { name: "Rajesh Kamath", role: "Category manager", status: "Approved", email: "rajesh@kamath.com" },
        ]}
      />
    </div>
  );
}

function ApprovalGroup({
  title,
  rows,
}: {
  title: string;
  rows: { name: string; role: string; status: Status; email: string }[];
}) {
  return (
    <section>
      <h3 className="mb-4 text-lg font-bold text-foreground">{title}</h3>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-[280px_1fr_1fr] items-center gap-6 rounded-xl border border-border bg-card px-5 py-3 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                DT
              </span>
              <div>
                <div className="text-sm font-bold text-foreground">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.role}</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Status</div>
              <div className={`text-sm font-semibold ${STATUS_COLOR[r.status]}`}>{r.status}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="text-sm text-foreground">{r.email}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- RFP Builder tab ---------------- */

type BuilderStep = "basic" | "market" | "cost" | "draft" | "evaluation" | "published";

function BuilderTab({
  stage,
  setStage,
  showBuildDetails,
  setShowBuildDetails,
}: {
  stage: BuilderStage;
  setStage: (s: BuilderStage) => void;
  showBuildDetails: boolean;
  setShowBuildDetails: (v: boolean) => void;
}) {
  const [step, setStep] = useState<BuilderStep>("basic");
  const isPublished = stage === "published";

  const steps: { id: BuilderStep; label: string; visible: boolean }[] = [
    { id: "basic", label: "Basic info", visible: true },
    { id: "market", label: "Market analysis", visible: true },
    { id: "cost", label: "Cost model", visible: true },
    { id: "draft", label: "Draft RFP", visible: stage !== "published" },
    { id: "evaluation", label: stage === "published" ? "Evaluation" : "Evaluation Criteria", visible: true },
    { id: "published", label: "Published RFP", visible: stage === "published" },
  ];

  // Published, collapsed preview mode — land on the document, not the wizard.
  if (isPublished && !showBuildDetails) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">RFP Preview</h2>
            <p className="text-xs text-muted-foreground">Published document as sent to invited vendors.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBuildDetails(true)}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-accent/50"
            >
              View build details
              <span className="text-[10px]">▾</span>
            </button>
          </div>
        </div>
        {/* dev: stage switcher kept available for demo even in preview mode */}
        <div className="inline-flex flex-wrap gap-1 rounded-lg border border-dashed border-border p-2">
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Demo stage:</span>
          {(["in-progress", "draft-ready", "published"] as BuilderStage[]).map((s) => (
            <button
              key={s}
              onClick={() => setStage(s)}
              className={`rounded px-2 py-1 text-xs ${
                stage === s ? "bg-accent/10 text-accent font-semibold" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <PublishedRfpStep />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isPublished && (
        <div className="flex items-center justify-between rounded-md border border-border bg-muted/30 px-3 py-2">
          <span className="text-xs text-muted-foreground">Viewing build details for a published RFP.</span>
          <button
            onClick={() => setShowBuildDetails(false)}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-accent/50"
          >
            Back to RFP preview
          </button>
        </div>
      )}
      <div className="flex gap-6">
        {/* sub-sidebar */}
        <aside className="w-48 shrink-0">
          <ul className="space-y-1">
            {steps.filter((s) => s.visible).map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setStep(s.id)}
                  className={`flex w-full items-center justify-between rounded-md py-2 pl-3 pr-2 text-left text-sm font-semibold transition ${
                    step === s.id ? "text-accent" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{s.label}</span>
                  {step === s.id && <span className="h-6 w-0.5 rounded-full bg-accent" />}
                </button>
              </li>
            ))}
          </ul>

          {/* dev: stage switcher (not in screenshots, helpful demo) */}
          <div className="mt-8 rounded-lg border border-dashed border-border p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Demo: Stage</div>
            {(["in-progress", "draft-ready", "published"] as BuilderStage[]).map((s) => (
              <button
                key={s}
                onClick={() => setStage(s)}
                className={`block w-full rounded px-2 py-1 text-left text-xs ${
                  stage === s ? "bg-accent/10 text-accent font-semibold" : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          {step === "basic" && <BasicInfoStep />}
          {step === "market" && <MarketAnalysisStep />}
          {step === "cost" && <CostModelStep />}
          {step === "draft" && <DraftRfpStep />}
          {step === "evaluation" && <EvaluationCriteriaStep />}
          {step === "published" && <PublishedRfpStep />}
        </div>
      </div>
    </div>
  );
}

function BasicInfoStep() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="space-y-4">
        <Field label="RFP title">
          <input
            defaultValue="Steel Materials"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </Field>
        <Field label="Sourcing type">
          <SelectField value="RFP" options={["RFP", "RFQ", "RFI"]} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Award deadline">
            <input
              defaultValue="Feb 23, 2027"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </Field>
          <Field label="Submission deadline">
            <input
              defaultValue="Feb 23, 2027"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </Field>
        </div>
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <Field label="Estimated value">
            <input
              defaultValue="500"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </Field>
          <Field label="Currency">
            <SelectField value="USD" options={["USD", "EUR"]} />
          </Field>
        </div>
      </div>
    </div>
  );
}

function MarketAnalysisStep() {
  const [criteria, setCriteria] = useState([
    "Price Competitiveness",
    "Delivery Timeline",
    "Quality Certifications",
    "Supplier Stability",
  ]);
  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground">AI Market Insights</h3>
        <p className="mt-3 text-sm text-foreground">Based on historical data and market trends:</p>
        <ul className="mt-2 ml-5 list-disc space-y-1 text-sm text-foreground">
          <li>Average market rate for steel: $42-48/unit</li>
          <li>5 qualified suppliers available in region</li>
          <li>Lead time: 4-6 weeks typical</li>
          <li>Price volatility: Moderate (±5% expected)</li>
        </ul>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold text-foreground">Evaluation Criteria</h3>
        <ul className="mt-3">
          {criteria.map((c, i) => (
            <li key={c} className={`flex items-center gap-3 py-3 ${i === criteria.length - 1 ? "" : "border-b border-dashed border-border"}`}>
              <input type="checkbox" className="h-4 w-4 rounded border-border" />
              <span className="text-sm text-foreground">{c}</span>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setCriteria((c) => [...c, "New Criteria"])}
          className="mt-3 inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          <Plus className="h-4 w-4" /> Add Criteria
        </button>
      </div>
    </div>
  );
}

const COST_ROWS = [
  { name: "Shrink Film Roll (Shrink Film...", gst: 16, amount: 85500 },
  { name: "Stainless Steel Rods (500 un...", gst: 52, amount: 37000 },
  { name: "Assembly Equipment", gst: 16, amount: 1940000 },
  { name: "Safety Helmets (200 units)", gst: 52, amount: 192000 },
  { name: "Carbon Steel Sheets (1000 u...", gst: 16, amount: 85500 },
  { name: "Stainless Steel Rods (500 un...", gst: 52, amount: 37000 },
  { name: "Assembly Equipment", gst: 16, amount: 1940000 },
  { name: "Safety Helmets (200 units)", gst: 52, amount: 192000 },
];

function CostModelStep() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground">Cost Model</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Procurement for Indore | Strategy: location | Total Value: 11875931.229999999 INR | 11 unique materials/services
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SelectField value="Full cost model" options={["Full cost model"]} small />
          <button className="rounded-md bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20">
            Generate Draft RFP
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <MiniStat label="Materials" value="11" />
        <MiniStat label="Components" value="58" />
        <MiniStat label="Procurement Types" value="Finished goods" />
      </div>

      <h3 className="pt-2 text-lg font-bold text-foreground">Components</h3>

      <CostComponentGroup expanded />
      <CostComponentGroup />
      <CostComponentGroup />
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="mt-2 text-xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function CostComponentGroup({ expanded }: { expanded?: boolean }) {
  const [open, setOpen] = useState(!!expanded);
  return (
    <div className={`rounded-xl border bg-card shadow-sm ${open ? "border-accent" : "border-border"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <span className="font-bold text-foreground">Shrink Film Rolls</span>
        <span className="flex items-center gap-3 text-sm text-muted-foreground">
          <span className="rounded-full bg-[oklch(0.7_0.16_155)] px-3 py-1 text-xs font-semibold text-white">Finished Good</span>
          <span>7 components</span>
          <span>$77,000</span>
          {open ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
        </span>
      </button>
      {open && (
        <div className="border-t border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left text-xs text-muted-foreground">
                <th className="px-4 py-3 font-semibold text-foreground">
                  <span className="inline-flex items-center gap-1">Component <ArrowDown className="h-3 w-3" /></span>
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">Category</th>
                <th className="px-4 py-3 font-semibold text-foreground">Type</th>
                <th className="px-4 py-3 font-semibold text-foreground">UOM</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">GST%</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Unit Rate</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Amount</th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Total (incl GST)</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {COST_ROWS.map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 text-foreground">{r.name}</td>
                  <td className="px-4 py-2.5 text-foreground">Material</td>
                  <td className="px-4 py-2.5 text-foreground">BOM</td>
                  <td className="px-4 py-2.5 text-foreground">EA</td>
                  <td className="px-4 py-2.5 text-right text-foreground">{r.gst}</td>
                  <td className="px-4 py-2.5 text-right text-foreground">${r.amount.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-foreground">${r.amount.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right text-foreground">${r.amount.toLocaleString()}</td>
                  <td className="px-2 py-2.5"><MoreVertical className="h-4 w-4 text-muted-foreground" /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3">
            <button className="rounded-md bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20">
              Add a component
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Draft RFP (toolbar + loading or content) ---- */

function EditorToolbar({ rightSlot }: { rightSlot?: React.ReactNode }) {
  const Btn = ({ children }: { children: React.ReactNode }) => (
    <button className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">{children}</button>
  );
  return (
    <div className="flex items-center gap-1 border-b border-border bg-card px-3 py-2">
      <div className="relative">
        <select className="appearance-none rounded border border-border bg-background pr-6 pl-2 py-1 text-xs outline-none">
          <option>Normal</option>
        </select>
        <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
      </div>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn><Bold className="h-4 w-4" /></Btn>
      <Btn><Italic className="h-4 w-4" /></Btn>
      <Btn><UnderlineIcon className="h-4 w-4" /></Btn>
      <Btn><Strikethrough className="h-4 w-4" /></Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn><AlignLeft className="h-4 w-4" /></Btn>
      <Btn><AlignCenter className="h-4 w-4" /></Btn>
      <Btn><AlignRight className="h-4 w-4" /></Btn>
      <Btn><AlignJustify className="h-4 w-4" /></Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn><ListOrdered className="h-4 w-4" /></Btn>
      <Btn><List className="h-4 w-4" /></Btn>
      <Btn><ListChecks className="h-4 w-4" /></Btn>
      <Btn><Indent className="h-4 w-4" /></Btn>
      <Btn><Outdent className="h-4 w-4" /></Btn>
      <span className="mx-1 h-5 w-px bg-border" />
      <Btn><Type className="h-4 w-4" /></Btn>
      <Btn><Highlighter className="h-4 w-4" /></Btn>
      <Btn><Eraser className="h-4 w-4" /></Btn>
      <Btn><Link2 className="h-4 w-4" /></Btn>
      <Btn><Paperclip className="h-4 w-4" /></Btn>
      <div className="ml-auto">{rightSlot}</div>
    </div>
  );
}

function DraftRfpStep() {
  const [loading, setLoading] = useState(true);
  return (
    <div className="grid grid-cols-[1fr_320px] gap-6">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <EditorToolbar
          rightSlot={
            <button
              onClick={() => setLoading((v) => !v)}
              className="rounded-md bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20"
            >
              Regenerate Draft RFP
            </button>
          }
        />
        <div className="min-h-[500px] bg-card p-8">
          {loading ? <DraftLoading /> : <DraftContent />}
        </div>
      </div>
      <div className="space-y-5">
        <VersionHistory />
        <AiRefinement />
      </div>
    </div>
  );
}

function DraftLoading() {
  const steps = [
    { label: "Generating RFP Draft", done: true },
    { label: "Analysing context", done: true },
    { label: "Combobulating meaning", done: false },
  ];
  return (
    <div className="mx-auto max-w-xl space-y-6 py-16">
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-3">
          {s.done ? (
            <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-[oklch(0.7_0.16_155)] text-white">
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
          ) : (
            <Clock className="mt-0.5 h-5 w-5 text-foreground" />
          )}
          <div>
            <div className="text-sm font-semibold text-foreground">{s.label}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              AI is creating your RFP document based on your requirements and parameters. This may take a few moments.
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DraftContent() {
  return (
    <article className="prose max-w-none text-sm text-foreground">
      <h1 className="text-3xl font-bold">Cover Page</h1>
      <h2 className="mt-6 text-base font-bold">1.1 Issuing Organization Details</h2>
      <CoverTable />
      <h2 className="mt-8 text-base font-bold">1.2 RFP Identification</h2>
      <CoverTable />
      <h2 className="mt-8 text-base font-bold">1.3 Key Dates & Deadlines</h2>
      <CoverTable />
      <h2 className="mt-8 text-base font-bold">1.4 Contact Information</h2>
      <CoverTable />

      <h1 className="mt-12 text-2xl font-bold">Executive Summary and Opportunity</h1>
      <h3 className="mt-4 font-bold">2.1 Background & Context</h3>
      <p className="mt-2 text-sm leading-6">
        Acme Manufacturing Pvt. Ltd. is a leading manufacturing firm dedicated to operational excellence and consistent product delivery. Our Plant 19 in Hyderabad plays a crucial role in our production ecosystem, and ensuring a seamless supply chain for essential raw materials is paramount to maintaining our operational schedules and product quality. This Request for Proposal (RFP) is initiated to address a critical requirement for specialized packaging materials, specifically Shrink Film Rolls.
      </p>
      <p className="mt-3 text-sm leading-6">
        The current market dynamics necessitate a robust and reliable sourcing strategy to mitigate supply risks and secure competitive pricing. This procurement aims to not only fulfill an immediate need but also to fortify our supply chain for packaging materials, thereby supporting the uninterrupted functioning of our manufacturing processes at the Hyderabad facility. This initiative aligns strategically with our organizational goals of optimizing resource allocation and enhancing overall efficiency in our production cycle.
      </p>
    </article>
  );
}

function CoverTable() {
  const rows = [
    ["Company Name", "Acme Manufacturing Pvt. Ltd."],
    ["Registered Address", "Plot No. 45, Industrial Area Phase-II"],
    ["City, State", "Gurugram, Haryana"],
    ["PIN/ZIP Code", "122001"],
    ["Website", "acmemanufacturing.com"],
    ["GST/Tax ID", "06AABCU9603R1ZM"],
    ["CIN", "U74999HR2015PTC123456"],
  ];
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border text-left">
          <th className="py-2 font-bold text-foreground">Field</th>
          <th className="py-2 font-bold text-foreground">Details</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([k, v]) => (
          <tr key={k} className="border-b border-dashed border-border">
            <td className="py-2 text-muted-foreground">{k}</td>
            <td className={`py-2 ${k === "Website" ? "text-primary underline" : "text-foreground"}`}>{v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function VersionHistory() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-base font-bold text-foreground">Version history</h3>
      <ul className="mt-3 space-y-1">
        {[5, 4, 3, 2, 1].map((v, i) => (
          <li key={v} className={`flex items-center justify-between py-2 ${i === 4 ? "" : "border-b border-dashed border-border"}`}>
            <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText className="h-4 w-4 text-muted-foreground" /> Version {v}
            </span>
            <span className="text-xs text-muted-foreground">Apr 13, 2026 @ 12:56 PM</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AiRefinement() {
  return (
    <div className="rounded-xl border border-accent/30 bg-accent/5 p-5">
      <h3 className="inline-flex items-center gap-2 text-base font-bold text-foreground">
        <Sparkles className="h-4 w-4 text-accent" /> AI Refinement
      </h3>
      <textarea
        placeholder="Ask AI to refine your request for proposal..."
        rows={6}
        className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}

function EvaluationCriteriaStep() {
  return (
    <div className="space-y-4">
      <CriteriaSection
        title="Technical requirements"
        expanded
        items={[
          "Plastic packaging materials must be suitable for packaging without adverse chemical reaction.",
          "Plastic packaging materials must provide adequate barrier properties against moisture, oxygen, and light as per specific product needs.",
          "Plastic packaging materials must maintain structural integrity under various storage and transport conditions.",
          "Plastic packaging materials must be compatible with existing filling and sealing equipment at Acme Manufacturing plants.",
          "Plastic packaging materials must be recyclable and conform to post-consumer waste management standards where applicable.",
          "Polymer Type for Plastic Variants must be as per specified grade.",
          'Density for Plastic Variants must be +/- 0.005 g/cm" of target.',
          "Melt Flow Index (MFI) for Plastic Variants must be within +/- 1.0 g/10min of target.",
        ]}
      />
      <CriteriaSection title="Another set of lists" />
      <CriteriaSection title="Another set of lists" />
      <CriteriaSection title="Another set of lists" />
    </div>
  );
}

function CriteriaSection({ title, items, expanded }: { title: string; items?: string[]; expanded?: boolean }) {
  const [open, setOpen] = useState(!!expanded);
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between px-5 py-4">
        <span className="font-bold text-foreground">{title}</span>
        {open ? <ArrowUp className="h-4 w-4 text-muted-foreground" /> : <ArrowDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && items && (
        <div className="border-t border-border px-5 pb-4">
          {items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 border-b border-dashed border-border py-3 last:border-0">
              <input type="checkbox" className="h-4 w-4 rounded border-border" />
              <span className="flex-1 text-sm text-foreground">{it}</span>
              <span className="text-xs text-muted-foreground">Marks</span>
              <div className="relative">
                <select className="appearance-none rounded border border-border bg-background pl-3 pr-7 py-1 text-sm">
                  <option>10</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PublishedRfpStep() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <EditorToolbar
        rightSlot={
          <button className="rounded-md bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20">
            Download as PDF
          </button>
        }
      />
      <div className="bg-card p-8">
        <DraftContent />
      </div>
    </div>
  );
}

/* ---------------- Vendors tab ---------------- */

type VendorStatus = "Not Submitted" | "Pending Verification" | "Qualified" | "Under Negotiation" | "Ready for NFA" | "PO Initiated" | "In Contracting";

type VendorRow = { name: string; cost: string; status: VendorStatus; score: number; riskScore: number; performanceScore: number | null };

const VENDORS: VendorRow[] = [
  { name: "Dell Technologies", cost: "Found", status: "Qualified", score: 80, riskScore: 18, performanceScore: 86 },
  { name: "Lenovo Group", cost: "Found", status: "Pending Verification", score: 50, riskScore: 42, performanceScore: 71 },
  { name: "HP Inc.", cost: "Not found", status: "Pending Verification", score: 100, riskScore: 12, performanceScore: null },
  { name: "Dell Technologies", cost: "Found", status: "Qualified", score: 50, riskScore: 28, performanceScore: 78 },
  { name: "Lenovo Group", cost: "Found", status: "Ready for NFA", score: 40, riskScore: 55, performanceScore: 64 },
  { name: "HP Inc.", cost: "Not found", status: "Not Submitted", score: 20, riskScore: 74, performanceScore: null },
  { name: "Lenovo Group", cost: "Found", status: "Ready for NFA", score: 10, riskScore: 38, performanceScore: 49 },
  { name: "HP Inc.", cost: "Not found", status: "Pending Verification", score: 80, riskScore: 22, performanceScore: null },
];



/* Award / PO data model */

type PoAllocation = { itemId: string; itemName: string; itemSpec?: string; qty: number; unit: string; unitPrice: number };
type PurchaseOrder = {
  id: string;
  vendor: string;
  allocations: PoAllocation[];
  total: number;
  deliveryDate?: string;
  shipTo?: string;
  notes?: string;
  createdAt: string;
};

/* Negotiation data model */

type RoundStatus = "open" | "awaiting" | "closed" | "declined";
type ChatMsg = { role: "me" | "leah"; text: string; time: string };
type LineItem = {
  id: string;
  name: string;
  spec?: string;
  qty: number;
  unit: string;
  openingUnitPrice: number;
  targetUnitPrice: number;
};
type LineBid = { itemId: string; unitPrice: number };

type TermKey = "delivery" | "incoterms" | "payment" | "warranty" | "penalty";
type TermBid = { key: TermKey; value: string; agreed?: boolean };
const TERM_LABELS: Record<TermKey, string> = {
  delivery: "Delivery lead time",
  incoterms: "Incoterms",
  payment: "Payment terms",
  warranty: "Warranty",
  penalty: "Late delivery penalty",
};
const TERM_OPTIONS: Partial<Record<TermKey, string[]>> = {
  incoterms: ["EXW", "FOB", "CIF", "CFR", "DDP", "DAP"],
  payment: ["100% advance", "Net 30", "Net 45", "Net 60", "50% advance / 50% on delivery"],
};

type Round = {
  id: number;
  status: RoundStatus;
  openedAt: string;
  closedAt?: string;
  bid: number; // derived total — kept in sync with lineBids
  deltaPct?: number;
  note?: string;
  lineBids: LineBid[];
  termBids?: TermBid[];
  chat: ChatMsg[];
};
type Negotiation = {
  id: string;
  vendor: string;
  scope: string;
  startedAt: string;
  sellerOpening: number;
  aiTarget: number;
  status: "open" | "awaiting" | "concluded" | "declined";
  items: LineItem[];
  openingTerms: TermBid[];
  targetTerms: TermBid[];
  rounds: Round[];
};

const DEFAULT_OPENING_TERMS: TermBid[] = [
  { key: "delivery", value: "8 weeks" },
  { key: "incoterms", value: "EXW Shanghai" },
  { key: "payment", value: "100% advance" },
  { key: "warranty", value: "6 months" },
  { key: "penalty", value: "None" },
];
const DEFAULT_TARGET_TERMS: TermBid[] = [
  { key: "delivery", value: "4 weeks" },
  { key: "incoterms", value: "FOB" },
  { key: "payment", value: "Net 60" },
  { key: "warranty", value: "24 months" },
  { key: "penalty", value: "0.5% / week" },
];

function computeRoundTotal(items: LineItem[], lineBids: LineBid[]): number {
  return items.reduce((sum, it) => {
    const lb = lineBids.find((b) => b.itemId === it.id);
    return sum + (lb?.unitPrice ?? it.openingUnitPrice) * it.qty;
  }, 0);
}

const SEED_NEGOTIATIONS: Negotiation[] = [
  {
    id: "n1",
    vendor: "Dell Technologies",
    scope: "Carbon Steel Sheets (1000 units)",
    startedAt: "Apr 15, 2026",
    sellerOpening: 48200,
    aiTarget: 42000,
    status: "open",
    items: [
      { id: "i1", name: "Carbon Steel Sheet", spec: "3mm · 1m × 2m", qty: 600, unit: "sheet", openingUnitPrice: 30, targetUnitPrice: 26 },
      { id: "i2", name: "Carbon Steel Sheet", spec: "5mm · 1m × 2m", qty: 400, unit: "sheet", openingUnitPrice: 75.5, targetUnitPrice: 65 },
    ],
    openingTerms: DEFAULT_OPENING_TERMS,
    targetTerms: DEFAULT_TARGET_TERMS,
    rounds: [
      {
        id: 1,
        status: "closed",
        openedAt: "Apr 15",
        closedAt: "Apr 16",
        bid: 45500,
        deltaPct: -5.6,
        note: "Vendor responded with revised quote.",
        lineBids: [
          { itemId: "i1", unitPrice: 28 },
          { itemId: "i2", unitPrice: 71.75 },
        ],
        chat: [
          { role: "me", time: "09:41", text: "Opening bid is $48,200. What should our counter be?" },
          { role: "leah", time: "09:41", text: "3mm sheets are 6.7% over market; push harder there. 5mm is closer to fair — anchor blended counter at $43,500." },
        ],
      },
      {
        id: 2,
        status: "awaiting",
        openedAt: "Apr 18",
        bid: 43800,
        lineBids: [
          { itemId: "i1", unitPrice: 27 },
          { itemId: "i2", unitPrice: 69 },
        ],
        chat: [
          { role: "me", time: "11:02", text: "We countered at $27 / $68. Vendor came back at $27 / $69." },
          { role: "leah", time: "11:02", text: "5mm is the gap — $1 over target. Accept, or push once more on i2 only; close-rate at this delta is 68%." },
        ],
      },
    ],
  },
  {
    id: "n2",
    vendor: "Dell Technologies",
    scope: "Stainless Steel Rods (500 units)",
    startedAt: "Apr 14, 2026",
    sellerOpening: 32000,
    aiTarget: 28500,
    status: "concluded",
    items: [
      { id: "i1", name: "SS Rod", spec: "10mm × 3m", qty: 300, unit: "rod", openingUnitPrice: 40, targetUnitPrice: 36 },
      { id: "i2", name: "SS Rod", spec: "14mm × 3m", qty: 200, unit: "rod", openingUnitPrice: 100, targetUnitPrice: 88 },
    ],
    openingTerms: DEFAULT_OPENING_TERMS,
    targetTerms: DEFAULT_TARGET_TERMS.map((t) => ({ ...t, agreed: true })),
    rounds: [
      {
        id: 1,
        status: "closed",
        openedAt: "Apr 14",
        closedAt: "Apr 15",
        bid: 30200,
        deltaPct: -5.6,
        lineBids: [
          { itemId: "i1", unitPrice: 38 },
          { itemId: "i2", unitPrice: 94 },
        ],
        chat: [{ role: "leah", time: "10:00", text: "Counter at $37 / $89." }],
      },
      {
        id: 2,
        status: "closed",
        openedAt: "Apr 15",
        closedAt: "Apr 16",
        bid: 28900,
        deltaPct: -4.3,
        lineBids: [
          { itemId: "i1", unitPrice: 37 },
          { itemId: "i2", unitPrice: 89 },
        ],
        chat: [{ role: "leah", time: "14:21", text: "Within 1.4% of target — recommend accept." }],
      },
    ],
  },
];

function VendorsTab() {
  const { id } = Route.useParams();
  const [invite, setInvite] = useState(false);
  const [compare, setCompare] = useState(false);
  const [submissionOpen, setSubmissionOpen] = useState(false);
  const [vendors, setVendors] = useState<VendorRow[]>(VENDORS);
  const [awardOpenForIdx, setAwardOpenForIdx] = useState<number | null>(null);
  const [contractOpenForIdx, setContractOpenForIdx] = useState<number | null>(null);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [subTab, setSubTab] = useState<"responses" | "negotiation">("responses");
  const [negotiations, setNegotiations] = useState<Negotiation[]>(SEED_NEGOTIATIONS);
  const [selectedNegId, setSelectedNegId] = useState<string | null>(null);

  function advance(i: number, to: VendorStatus) {
    setVendors((vs) => vs.map((v, idx) => (idx === i ? { ...v, status: to } : v)));
  }

  function startNegotiation(i: number) {
    const v = vendors[i];
    const items: LineItem[] = [
      { id: "i1", name: "Line item 1", spec: "Define spec", qty: 1, unit: "unit", openingUnitPrice: 50000, targetUnitPrice: 45000 },
    ];
    const newNeg: Negotiation = {
      id: `n${Date.now()}`,
      vendor: v.name,
      scope: "New scope — to be defined",
      startedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      sellerOpening: 50000,
      aiTarget: 45000,
      status: "open",
      items,
      openingTerms: DEFAULT_OPENING_TERMS,
      targetTerms: DEFAULT_TARGET_TERMS,
      rounds: [
        {
          id: 1,
          status: "open",
          openedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          bid: 50000,
          lineBids: items.map((it) => ({ itemId: it.id, unitPrice: it.openingUnitPrice })),
          chat: [
            { role: "leah", time: "Now", text: `Based on previous negotiations with ${v.name}, a target of $45,000 is realistic. I recommend opening at $43,500.` },
          ],
        },
      ],
    };
    setNegotiations((ns) => [newNeg, ...ns]);
    advance(i, "Under Negotiation");
    setSubTab("negotiation");
    setSelectedNegId(newNeg.id);
  }

  function jumpToVendorNegotiation(vendorName: string) {
    const found = negotiations.find((n) => n.vendor === vendorName && n.status !== "concluded");
    if (found) {
      setSubTab("negotiation");
      setSelectedNegId(found.id);
    }
  }

  const openNegCount = negotiations.filter((n) => n.status === "open" || n.status === "awaiting").length;

  return (
    <div className="space-y-6">
      {/* Sub-tab strip */}
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
        <SubTab active={subTab === "responses"} onClick={() => { setSubTab("responses"); setSelectedNegId(null); }}>
          Responses
        </SubTab>
        <SubTab active={subTab === "negotiation"} onClick={() => setSubTab("negotiation")}>
          Negotiation
          {openNegCount > 0 && (
            <span className="ml-1.5 rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold text-accent">{openNegCount} open</span>
          )}
        </SubTab>
      </div>

      {subTab === "responses" ? (
        <ResponsesView
          id={id}
          vendors={vendors}
          advance={advance}
          purchaseOrders={purchaseOrders}
          onStartNegotiation={startNegotiation}
          onViewNegotiation={jumpToVendorNegotiation}
          onInitiatePO={(i) => setAwardOpenForIdx(i)}
          onStartContract={(i) => setContractOpenForIdx(i)}
          onOpenInvite={() => setInvite(true)}
          onOpenCompare={() => setCompare(true)}
          onOpenSubmission={() => setSubmissionOpen(true)}
        />
      ) : selectedNegId ? (
        <NegotiationDetailView
          negotiation={negotiations.find((n) => n.id === selectedNegId)!}
          onBack={() => setSelectedNegId(null)}
          onUpdate={(updated) => setNegotiations((ns) => ns.map((n) => (n.id === updated.id ? updated : n)))}
          onAccept={(neg) => {
            setNegotiations((ns) => ns.map((n) => (n.id === neg.id ? { ...n, status: "concluded" } : n)));
            const idx = vendors.findIndex((v) => v.name === neg.vendor);
            if (idx >= 0) advance(idx, "Ready for NFA");
            setSelectedNegId(null);
          }}
        />
      ) : (
        <NegotiationListView
          negotiations={negotiations}
          onOpen={(nid) => setSelectedNegId(nid)}
        />
      )}

      {invite && <InviteVendorsModal onClose={() => setInvite(false)} />}
      {compare && <VendorComparisonModal onClose={() => setCompare(false)} />}
      {submissionOpen && <AddSubmissionModal onClose={() => setSubmissionOpen(false)} />}
      {awardOpenForIdx !== null && (
        <AwardPoModal
          initialVendor={vendors[awardOpenForIdx].name}
          eligibleVendors={vendors.filter((v) => v.status === "Ready for NFA" || v.status === "PO Initiated").map((v) => v.name)}
          negotiations={negotiations}
          onClose={() => setAwardOpenForIdx(null)}
          onConfirm={(pos) => {
            setPurchaseOrders((prev) => [...prev, ...pos]);
            const awardedVendors = new Set(pos.map((p) => p.vendor));
            setVendors((vs) => vs.map((v) => (awardedVendors.has(v.name) && v.status === "Ready for NFA" ? { ...v, status: "PO Initiated" } : v)));
            setAwardOpenForIdx(null);
          }}
        />
      )}
      {contractOpenForIdx !== null && (
        <StartContractModal
          vendor={vendors[contractOpenForIdx].name}
          onClose={() => setContractOpenForIdx(null)}
          onConfirm={() => {
            const i = contractOpenForIdx;
            setVendors((vs) => vs.map((v, idx) => (idx === i ? { ...v, status: "In Contracting" } : v)));
            setContractOpenForIdx(null);
          }}
        />
      )}
    </div>
  );
}

function SubTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold transition ${
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function ResponsesView({
  id,
  vendors,
  advance,
  purchaseOrders,
  onStartNegotiation,
  onViewNegotiation,
  onInitiatePO,
  onStartContract,
  onOpenInvite,
  onOpenCompare,
  onOpenSubmission,
}: {
  id: string;
  vendors: VendorRow[];
  advance: (i: number, to: VendorStatus) => void;
  purchaseOrders: PurchaseOrder[];
  onStartNegotiation: (i: number) => void;
  onViewNegotiation: (vendorName: string) => void;
  onInitiatePO: (i: number) => void;
  onStartContract: (i: number) => void;
  onOpenInvite: () => void;
  onOpenCompare: () => void;
  onOpenSubmission: () => void;
}) {
  return (
    <div className="space-y-8">
      {purchaseOrders.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Purchase Orders</h3>
            <span className="text-xs text-muted-foreground">{purchaseOrders.length} generated</span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-foreground">{po.id}</div>
                  <Pill color="green">PO Initiated</Pill>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{po.vendor} · {po.allocations.length} line{po.allocations.length > 1 ? "s" : ""}</div>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <div className="text-[11px] text-muted-foreground">Total</div>
                    <div className="text-lg font-bold text-foreground">${po.total.toLocaleString()}</div>
                  </div>
                  <div className="text-right text-[11px] text-muted-foreground">{po.createdAt}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-foreground">Vendor response tracker</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search vendors"
                className="w-56 rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:border-accent"
              />
            </div>
            <button className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted">Export Supplier List</button>
            <IconAction label="Vendor Comparison" onClick={onOpenCompare}>
              <GitCompare className="h-4 w-4" />
            </IconAction>
            <IconAction label="Invite Vendors" onClick={onOpenInvite}>
              <UserPlus className="h-4 w-4" />
            </IconAction>
            <IconAction label="Add Submission" onClick={onOpenSubmission}>
              <FilePlus2 className="h-4 w-4" />
            </IconAction>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-4 py-3 font-semibold text-foreground">
                  <span className="inline-flex items-center gap-1.5">Supplier <ArrowDown className="h-3.5 w-3.5" /></span>
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">Cost model</th>
                <th className="px-4 py-3 font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 font-semibold text-foreground">AI Score</th>
                <th className="px-4 py-3 font-semibold text-foreground">Risk Score</th>
                <th className="px-4 py-3 font-semibold text-foreground">Performance</th>
                <th className="px-4 py-3 font-semibold text-foreground">Submitted</th>
                <th className="px-4 py-3 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">JD</span>
                      <SupplierLink name={v.name} />
                    </span>
                  </td>

                  <td className="px-4 py-2.5">
                    <Pill color={v.cost === "Found" ? "green" : "red"}>{v.cost}</Pill>
                  </td>
                  <td className="px-4 py-2.5">
                    <Pill color={statusColor(v.status)}>{v.status}</Pill>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-40 overflow-hidden rounded-full bg-muted">
                        <div className="h-full rounded-full bg-[oklch(0.6_0.16_155)]" style={{ width: `${v.score}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-foreground">{v.score}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5"><ScoreLabel value={v.riskScore} kind="risk" /></td>
                  <td className="px-4 py-2.5"><ScoreLabel value={v.performanceScore} kind="perf" /></td>
                  <td className="px-4 py-2.5 text-foreground">{v.status === "Not Submitted" ? "—" : "Apr 15, 2026"}</td>

                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-1.5">
                      {v.status !== "Not Submitted" && (
                        <RowIconBtn label="View submission" asChild>
                          <Link to="/events/$id/review/$vendor" params={{ id, vendor: v.name }}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </RowIconBtn>
                      )}
                      {v.status === "Not Submitted" && (
                        <RowIconBtn label="Mark as received" onClick={() => advance(i, "Pending Verification")}>
                          <Upload className="h-4 w-4" />
                        </RowIconBtn>
                      )}
                      {v.status === "Pending Verification" && (
                        <RowIconBtn label="Review & qualify" onClick={() => advance(i, "Qualified")} tone="accent">
                          <ClipboardCheck className="h-4 w-4" />
                        </RowIconBtn>
                      )}
                      {v.status === "Qualified" && (
                        <RowIconBtn label="Start negotiation" onClick={() => onStartNegotiation(i)} tone="accent">
                          <MessageSquareText className="h-4 w-4" />
                        </RowIconBtn>
                      )}
                      {v.status === "Under Negotiation" && (
                        <RowIconBtn label="View negotiation" onClick={() => onViewNegotiation(v.name)} tone="accent">
                          <MessageSquareText className="h-4 w-4" />
                        </RowIconBtn>
                      )}
                      {v.status === "Ready for NFA" && (
                        <>
                          <RowIconBtn label="Initiate PO (Direct Buy)" onClick={() => onInitiatePO(i)} tone="success">
                            <ShoppingCart className="h-4 w-4" />
                          </RowIconBtn>
                          <RowIconBtn label="Start Contracting" onClick={() => onStartContract(i)} tone="accent">
                            <FileSignature className="h-4 w-4" />
                          </RowIconBtn>
                        </>
                      )}
                      {v.status === "PO Initiated" && (
                        <RowIconBtn label="PO initiated" tone="success">
                          <ShoppingCart className="h-4 w-4" />
                        </RowIconBtn>
                      )}
                      {v.status === "In Contracting" && (
                        <RowIconBtn label="Contract in progress" tone="accent">
                          <FileSignature className="h-4 w-4" />
                        </RowIconBtn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-lg font-bold text-foreground">Questions and answers log</h3>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-left">
                <th className="px-4 py-3 font-semibold text-foreground">Supplier</th>
                <th className="px-4 py-3 font-semibold text-foreground">Question</th>
                <th className="px-4 py-3 font-semibold text-foreground">Last activity</th>
                <th className="px-4 py-3 font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { v: "Dell Technologies", q: "Can docking stations be substituted with equivalent spec?", s: "Answered" },
                { v: "Lenovo Group", q: "Is split delivery across two dates acceptable?", s: "Answered" },
                { v: "HP Inc.", q: "What warranty terms are required for laptops?", s: "Waiting for answer" },
              ].map((r, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">JD</span>
                      <SupplierLink name={r.v} />
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-foreground">{r.q}</td>
                  <td className="px-4 py-2.5 text-foreground">Apr 15, 2026</td>
                  <td className="px-4 py-2.5">
                    <Pill color={r.s === "Answered" ? "green" : "yellow"}>{r.s}</Pill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

/* ---------------- Negotiation List View ---------------- */

function NegotiationListView({
  negotiations,
  onOpen,
}: {
  negotiations: Negotiation[];
  onOpen: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"open" | "all" | "concluded">("open");
  const filtered = negotiations.filter((n) =>
    filter === "all" ? true : filter === "open" ? n.status === "open" || n.status === "awaiting" : n.status === "concluded",
  );

  const openCount = negotiations.filter((n) => n.status === "open" || n.status === "awaiting").length;
  const concludedCount = negotiations.filter((n) => n.status === "concluded").length;
  const totalSavings = negotiations.reduce((acc, n) => {
    const latest = n.rounds[n.rounds.length - 1];
    return acc + Math.max(0, n.sellerOpening - latest.bid);
  }, 0);
  const vendorsCount = new Set(negotiations.filter((n) => n.status !== "concluded").map((n) => n.vendor)).size;

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <KpiCard label="Open negotiations" value={String(openCount)} hint={`${concludedCount} concluded`} />
        <KpiCard label="Estimated savings" value={`$${totalSavings.toLocaleString()}`} hint="vs seller opening" tone="success" />
        <KpiCard label="Vendors under negotiation" value={String(vendorsCount)} hint="active suppliers" />
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2">
        {(["open", "all", "concluded"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
              filter === f ? "bg-accent text-accent-foreground" : "border border-border bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-left">
              <th className="px-4 py-3 font-semibold text-foreground">Supplier</th>
              <th className="px-4 py-3 font-semibold text-foreground">Item / Scope</th>
              <th className="px-4 py-3 font-semibold text-foreground">Rounds</th>
              <th className="px-4 py-3 font-semibold text-foreground">Current offer</th>
              <th className="px-4 py-3 font-semibold text-foreground">Δ vs opening</th>
              <th className="px-4 py-3 font-semibold text-foreground">Status</th>
              <th className="px-4 py-3 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">No negotiations match this filter.</td></tr>
            )}
            {filtered.map((n) => {
              const latest = n.rounds[n.rounds.length - 1];
              const delta = ((latest.bid - n.sellerOpening) / n.sellerOpening) * 100;
              return (
                <tr key={n.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">JD</span>
                      <SupplierLink name={n.vendor} />
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-foreground">{n.scope}</td>
                  <td className="px-4 py-2.5">
                    <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-0.5 text-xs font-semibold text-foreground">
                      R{n.rounds.length}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 font-semibold text-foreground">${latest.bid.toLocaleString()}</td>
                  <td className={`px-4 py-2.5 text-xs font-semibold ${delta < 0 ? "text-[oklch(0.55_0.16_155)]" : "text-[oklch(0.55_0.22_25)]"}`}>
                    {delta > 0 ? "+" : ""}{delta.toFixed(1)}%
                  </td>
                  <td className="px-4 py-2.5">
                    <Pill color={negStatusColor(n.status)}>{negStatusLabel(n.status)}</Pill>
                  </td>
                  <td className="px-4 py-2.5">
                    <button
                      onClick={() => onOpen(n.id)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                    >
                      View negotiation <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "success" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${tone === "success" ? "text-[oklch(0.55_0.16_155)]" : "text-foreground"}`}>{value}</div>
      {hint && <div className="mt-1 text-[11px] text-muted-foreground">{hint}</div>}
    </div>
  );
}

function negStatusColor(s: Negotiation["status"]): PillColor {
  if (s === "open") return "purple";
  if (s === "awaiting") return "yellow";
  if (s === "concluded") return "green";
  return "red";
}
function negStatusLabel(s: Negotiation["status"]): string {
  if (s === "open") return "Open";
  if (s === "awaiting") return "Awaiting vendor";
  if (s === "concluded") return "Concluded";
  return "Declined";
}

/* ---------------- Negotiation Detail View ---------------- */

function NegotiationDetailView({
  negotiation,
  onBack,
  onUpdate,
  onAccept,
}: {
  negotiation: Negotiation;
  onBack: () => void;
  onUpdate: (n: Negotiation) => void;
  onAccept: (n: Negotiation) => void;
}) {
  const [activeRoundId, setActiveRoundId] = useState<number>(negotiation.rounds[negotiation.rounds.length - 1].id);
  const [counterOpen, setCounterOpen] = useState(false);
  const [counterNote, setCounterNote] = useState("");
  const [counterPrices, setCounterPrices] = useState<Record<string, string>>({});
  const [negTab, setNegTab] = useState<"price" | "terms">("price");

  const activeRound = negotiation.rounds.find((r) => r.id === activeRoundId) ?? negotiation.rounds[0];
  const isConcluded = negotiation.status === "concluded";
  const latestRound = negotiation.rounds[negotiation.rounds.length - 1];
  const canAddRound = !isConcluded && latestRound.status === "closed" && activeRound.id === latestRound.id;
  const totalDelta = ((latestRound.bid - negotiation.sellerOpening) / negotiation.sellerOpening) * 100;

  function openCounterForm() {
    const seed: Record<string, string> = {};
    activeRound.lineBids.forEach((lb) => { seed[lb.itemId] = String(lb.unitPrice); });
    setCounterPrices(seed);
    setCounterOpen(true);
  }

  function sendCounterOffer() {
    const newBids: LineBid[] = negotiation.items.map((it) => {
      const raw = counterPrices[it.id];
      const n = Number(raw);
      const existing = activeRound.lineBids.find((b) => b.itemId === it.id)?.unitPrice ?? it.openingUnitPrice;
      return { itemId: it.id, unitPrice: Number.isFinite(n) && n > 0 ? n : existing };
    });
    const total = computeRoundTotal(negotiation.items, newBids);
    const updated: Negotiation = {
      ...negotiation,
      status: "awaiting",
      rounds: negotiation.rounds.map((r) =>
        r.id === activeRound.id
          ? {
              ...r,
              status: "awaiting",
              bid: total,
              lineBids: newBids,
              note: counterNote || `Countered at $${total.toLocaleString()}`,
              chat: [
                ...r.chat,
                { role: "me", time: "Now", text: `Counter-offer sent — line prices updated. New total $${total.toLocaleString()}.${counterNote ? " " + counterNote : ""}` },
                { role: "leah", time: "Now", text: "Counter-offer logged per line item. Awaiting vendor — typical turnaround 24–48h." },
              ],
            }
          : r,
      ),
    };
    onUpdate(updated);
    setCounterOpen(false);
    setCounterNote("");
    setCounterPrices({});
  }

  function addNewRound() {
    const nextId = latestRound.id + 1;
    const updated: Negotiation = {
      ...negotiation,
      status: "open",
      rounds: [
        ...negotiation.rounds,
        {
          id: nextId,
          status: "open",
          openedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          bid: latestRound.bid,
          lineBids: latestRound.lineBids.map((lb) => ({ ...lb })),
          chat: [{ role: "leah", time: "Now", text: `Round ${nextId} opened. Previous total was $${latestRound.bid.toLocaleString()}. Counter per line item or hold.` }],
        },
      ],
    };
    onUpdate(updated);
    setActiveRoundId(nextId);
  }

  return (
    <div className="space-y-5">
      <div>
        <button onClick={onBack} className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-3.5 w-3.5" /> Back to negotiations
        </button>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-foreground">{negotiation.vendor}</h2>
              <Pill color={negStatusColor(negotiation.status)}>{negStatusLabel(negotiation.status)}</Pill>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {negotiation.scope} · Started {negotiation.startedAt}
            </div>
          </div>
          {!isConcluded && (
            <button
              onClick={() => onAccept(negotiation)}
              className="inline-flex items-center gap-1.5 rounded-md bg-[oklch(0.6_0.16_155)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              <Award className="h-4 w-4" /> Accept & finalize
            </button>
          )}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard label="Seller opening" value={`$${negotiation.sellerOpening.toLocaleString()}`} />
        <KpiCard label="AI target" value={`$${negotiation.aiTarget.toLocaleString()}`} />
        <KpiCard label="Current offer" value={`$${latestRound.bid.toLocaleString()}`} />
        <KpiCard label="Δ savings" value={`${totalDelta.toFixed(1)}%`} tone="success" hint={`$${(negotiation.sellerOpening - latestRound.bid).toLocaleString()} below opening`} />
      </div>

      {/* Negotiation tabs */}
      <div className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
        <SubTab active={negTab === "price"} onClick={() => setNegTab("price")}>
          <span className="inline-flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> Price negotiation</span>
        </SubTab>
        <SubTab active={negTab === "terms"} onClick={() => setNegTab("terms")}>
          <span className="inline-flex items-center gap-1.5"><Scale className="h-3.5 w-3.5" /> Terms negotiation</span>
        </SubTab>
      </div>

      {/* Two-column workspace */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
        {/* Rounds timeline */}
        <aside className="rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Rounds</div>
          <ul className="space-y-1.5">
            {negotiation.rounds.map((r) => {
              const active = r.id === activeRoundId;
              return (
                <li key={r.id}>
                  <button
                    onClick={() => setActiveRoundId(r.id)}
                    className={`flex w-full items-start gap-2.5 rounded-lg border p-2.5 text-left transition ${
                      active ? "border-accent bg-accent/5" : "border-transparent hover:border-border hover:bg-muted/40"
                    }`}
                  >
                    <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      r.status === "closed" ? "bg-[oklch(0.7_0.16_155)] text-white" :
                      r.status === "awaiting" ? "bg-[oklch(0.74_0.16_65)] text-white" :
                      r.status === "declined" ? "bg-[oklch(0.6_0.22_25)] text-white" :
                      "bg-accent text-accent-foreground"
                    }`}>{r.id}</span>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-foreground">Round {r.id}</div>
                      <div className="text-[10px] text-muted-foreground">
                        {r.openedAt}{r.closedAt ? ` → ${r.closedAt}` : ""} · ${r.bid.toLocaleString()}
                      </div>
                      {typeof r.deltaPct === "number" && (
                        <div className={`mt-0.5 text-[10px] font-bold ${r.deltaPct < 0 ? "text-[oklch(0.55_0.16_155)]" : "text-[oklch(0.55_0.22_25)]"}`}>
                          {r.deltaPct > 0 ? "+" : ""}{r.deltaPct.toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
            {canAddRound && (
              <li>
                <button
                  onClick={addNewRound}
                  className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:border-accent hover:text-accent"
                >
                  <Plus className="h-3.5 w-3.5" /> Add round
                </button>
              </li>
            )}
          </ul>
        </aside>

        {/* Round detail */}
        {negTab === "price" ? (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-foreground">Round {activeRound.id}</h3>
                  <Pill color={
                    activeRound.status === "closed" ? "green" :
                    activeRound.status === "awaiting" ? "yellow" :
                    activeRound.status === "declined" ? "red" : "purple"
                  }>{activeRound.status === "closed" ? "Closed" : activeRound.status === "awaiting" ? "Awaiting vendor" : activeRound.status === "declined" ? "Declined" : "Open"}</Pill>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Opened {activeRound.openedAt}{activeRound.closedAt ? ` · Closed ${activeRound.closedAt}` : ""}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] text-muted-foreground">Vendor bid</div>
                <div className="text-lg font-bold text-foreground">${activeRound.bid.toLocaleString()}</div>
              </div>
            </div>

            {/* Line-item breakdown for active round */}
            <div className="mb-4 overflow-hidden rounded-lg border border-border">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
                <div className="text-xs font-semibold text-foreground">Line-item breakdown · Round {activeRound.id}</div>
                <div className="text-[11px] text-muted-foreground">{negotiation.items.length} items</div>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/10 text-left">
                    <th className="px-3 py-2 font-semibold text-foreground">Item</th>
                    <th className="px-3 py-2 font-semibold text-foreground">Qty</th>
                    <th className="px-3 py-2 text-right font-semibold text-foreground">Opening</th>
                    <th className="px-3 py-2 text-right font-semibold text-foreground">Target</th>
                    <th className="px-3 py-2 text-right font-semibold text-foreground">This round</th>
                    <th className="px-3 py-2 text-right font-semibold text-foreground">Δ vs opening</th>
                    <th className="px-3 py-2 text-right font-semibold text-foreground">Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {negotiation.items.map((it) => {
                    const lb = activeRound.lineBids.find((b) => b.itemId === it.id);
                    const unit = lb?.unitPrice ?? it.openingUnitPrice;
                    const d = ((unit - it.openingUnitPrice) / it.openingUnitPrice) * 100;
                    const atTarget = unit <= it.targetUnitPrice;
                    return (
                      <tr key={it.id} className="border-b border-border last:border-0">
                        <td className="px-3 py-2">
                          <div className="font-medium text-foreground">{it.name}</div>
                          {it.spec && <div className="text-[10px] text-muted-foreground">{it.spec}</div>}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{it.qty} {it.unit}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">${it.openingUnitPrice.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right text-muted-foreground">${it.targetUnitPrice.toLocaleString()}</td>
                        <td className={`px-3 py-2 text-right font-semibold ${atTarget ? "text-[oklch(0.55_0.16_155)]" : "text-foreground"}`}>
                          ${unit.toLocaleString()}/{it.unit}
                        </td>
                        <td className={`px-3 py-2 text-right font-semibold ${d < 0 ? "text-[oklch(0.55_0.16_155)]" : d > 0 ? "text-[oklch(0.55_0.22_25)]" : "text-muted-foreground"}`}>
                          {d > 0 ? "+" : ""}{d.toFixed(1)}%
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-foreground">${(unit * it.qty).toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-muted/30">
                    <td className="px-3 py-2 font-bold text-foreground" colSpan={4}>Round total</td>
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2"></td>
                    <td className="px-3 py-2 text-right font-bold text-foreground">${activeRound.bid.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bid evolution (totals across rounds) */}
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="border-b border-border bg-muted/30 px-3 py-2 text-xs font-semibold text-foreground">Bid evolution across rounds</div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/10 text-left">
                    <th className="px-3 py-2 font-semibold text-foreground">Round</th>
                    <th className="px-3 py-2 font-semibold text-foreground">Status</th>
                    {negotiation.items.map((it) => (
                      <th key={it.id} className="px-3 py-2 text-right font-semibold text-foreground">
                        {it.name}
                        {it.spec && <div className="font-normal text-[10px] text-muted-foreground">{it.spec}</div>}
                      </th>
                    ))}
                    <th className="px-3 py-2 text-right font-semibold text-foreground">Total</th>
                    <th className="px-3 py-2 text-right font-semibold text-foreground">Δ vs prev</th>
                  </tr>
                </thead>
                <tbody>
                  {negotiation.rounds.map((r, idx) => {
                    const prev = idx > 0 ? negotiation.rounds[idx - 1].bid : negotiation.sellerOpening;
                    const d = ((r.bid - prev) / prev) * 100;
                    return (
                      <tr key={r.id} className={`border-b border-border last:border-0 ${r.id === activeRoundId ? "bg-accent/5" : ""}`}>
                        <td className="px-3 py-2 font-semibold text-foreground">R{r.id}</td>
                        <td className="px-3 py-2 capitalize text-muted-foreground">{r.status}</td>
                        {negotiation.items.map((it) => {
                          const lb = r.lineBids.find((b) => b.itemId === it.id);
                          const unit = lb?.unitPrice ?? it.openingUnitPrice;
                          return (
                            <td key={it.id} className="px-3 py-2 text-right font-medium text-foreground">${unit.toLocaleString()}</td>
                          );
                        })}
                        <td className="px-3 py-2 text-right font-semibold text-foreground">${r.bid.toLocaleString()}</td>
                        <td className={`px-3 py-2 text-right font-semibold ${d < 0 ? "text-[oklch(0.55_0.16_155)]" : "text-[oklch(0.55_0.22_25)]"}`}>
                          {d > 0 ? "+" : ""}{d.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inline AI chat */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-foreground">A</span>
                <div>
                  <div className="text-sm font-bold text-foreground">Leah · AI negotiator</div>
                  <div className="text-[11px] text-muted-foreground">Round {activeRound.id} conversation</div>
                </div>
              </div>
              <button className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                View Thinking <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="max-h-80 space-y-4 overflow-y-auto px-5 py-4">
              {activeRound.chat.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.role === "me" ? "items-end" : "items-start"} gap-1.5`}>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{m.role === "me" ? "Me" : "Leah"}</span>
                    <span>·</span>
                    <span>{m.time}</span>
                  </div>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "me" ? "rounded-tr-sm bg-accent/15 text-foreground" : "rounded-tl-sm bg-muted/50 text-foreground"
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {!isConcluded && activeRound.id === latestRound.id && (
              <div className="border-t border-border px-5 py-4">
                {counterOpen ? (
                  <div className="space-y-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Counter unit prices per line item</div>
                    <div className="overflow-hidden rounded-lg border border-border">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-border bg-muted/30 text-left">
                            <th className="px-3 py-2 font-semibold text-foreground">Item</th>
                            <th className="px-3 py-2 text-right font-semibold text-foreground">Current</th>
                            <th className="px-3 py-2 text-right font-semibold text-foreground">Target</th>
                            <th className="px-3 py-2 text-right font-semibold text-foreground">Counter ($ / unit)</th>
                            <th className="px-3 py-2 text-right font-semibold text-foreground">Line total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {negotiation.items.map((it) => {
                            const current = activeRound.lineBids.find((b) => b.itemId === it.id)?.unitPrice ?? it.openingUnitPrice;
                            const raw = counterPrices[it.id] ?? String(current);
                            const n = Number(raw);
                            const eff = Number.isFinite(n) && n > 0 ? n : current;
                            return (
                              <tr key={it.id} className="border-b border-border last:border-0">
                                <td className="px-3 py-2">
                                  <div className="font-medium text-foreground">{it.name}</div>
                                  {it.spec && <div className="text-[10px] text-muted-foreground">{it.spec} · {it.qty} {it.unit}</div>}
                                </td>
                                <td className="px-3 py-2 text-right text-muted-foreground">${current.toLocaleString()}</td>
                                <td className="px-3 py-2 text-right text-muted-foreground">${it.targetUnitPrice.toLocaleString()}</td>
                                <td className="px-3 py-2 text-right">
                                  <input
                                    type="number"
                                    value={raw}
                                    onChange={(e) => setCounterPrices((p) => ({ ...p, [it.id]: e.target.value }))}
                                    className="w-24 rounded-md border border-border bg-background px-2 py-1 text-right text-xs outline-none focus:border-accent"
                                  />
                                </td>
                                <td className="px-3 py-2 text-right font-semibold text-foreground">${(eff * it.qty).toLocaleString()}</td>
                              </tr>
                            );
                          })}
                          <tr className="bg-muted/30">
                            <td className="px-3 py-2 font-bold text-foreground" colSpan={4}>Counter total</td>
                            <td className="px-3 py-2 text-right font-bold text-foreground">
                              ${computeRoundTotal(negotiation.items, negotiation.items.map((it) => {
                                const raw = counterPrices[it.id];
                                const n = Number(raw);
                                const current = activeRound.lineBids.find((b) => b.itemId === it.id)?.unitPrice ?? it.openingUnitPrice;
                                return { itemId: it.id, unitPrice: Number.isFinite(n) && n > 0 ? n : current };
                              })).toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <input
                      value={counterNote}
                      onChange={(e) => setCounterNote(e.target.value)}
                      placeholder="Optional note to vendor"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setCounterOpen(false)} className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted">Cancel</button>
                      <button onClick={sendCounterOffer} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
                        <Send className="h-3.5 w-3.5" /> Send counter-offer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-muted-foreground">
                      Send a per-line counter to vendor, accept current offer, or open a new round.
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={openCounterForm}
                        className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted"
                      >
                        Send counter-offer
                      </button>
                      <button
                        onClick={() => onAccept(negotiation)}
                        className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                      >
                        Accept current offer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {isConcluded && (
              <div className="flex items-center justify-center gap-2 border-t border-border bg-accent/10 px-5 py-3 text-sm text-foreground">
                <Lock className="h-4 w-4" /> Chat disabled — Negotiation concluded
              </div>
            )}
          </div>
        </div>
        ) : (
          <TermsNegotiationView
            negotiation={negotiation}
            activeRound={activeRound}
            isLatest={activeRound.id === latestRound.id}
            isConcluded={isConcluded}
            onUpdate={onUpdate}
          />
        )}
      </div>
    </div>
  );
}

/* ---------------- Terms Negotiation View ---------------- */

function TermsNegotiationView({
  negotiation,
  activeRound,
  isLatest,
  isConcluded,
  onUpdate,
}: {
  negotiation: Negotiation;
  activeRound: Round;
  isLatest: boolean;
  isConcluded: boolean;
  onUpdate: (n: Negotiation) => void;
}) {
  const keys: TermKey[] = ["delivery", "incoterms", "payment", "warranty", "penalty"];
  const currentTerms: TermBid[] = activeRound.termBids ?? negotiation.openingTerms;
  const editable = !isConcluded && isLatest;

  function updateTerm(key: TermKey, patch: Partial<TermBid>) {
    const next = keys.map((k) => {
      const existing = currentTerms.find((t) => t.key === k) ?? { key: k, value: "" };
      return k === key ? { ...existing, ...patch } : existing;
    });
    const updatedRound: Round = { ...activeRound, termBids: next };
    onUpdate({ ...negotiation, rounds: negotiation.rounds.map((r) => (r.id === activeRound.id ? updatedRound : r)) });
  }

  const agreedCount = currentTerms.filter((t) => t.agreed).length;
  const openCount = keys.length - agreedCount;

  return (
    <div className="space-y-4">
      {/* KPI strip */}
      <div className="grid grid-cols-3 gap-3">
        <KpiCard label="Terms agreed" value={`${agreedCount} / ${keys.length}`} tone={agreedCount === keys.length ? "success" : undefined} />
        <KpiCard label="Open terms" value={String(openCount)} hint="awaiting agreement" />
        <KpiCard label="Round" value={`R${activeRound.id}`} hint={activeRound.status} />
      </div>

      {/* Terms table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
          <div className="text-sm font-bold text-foreground">Commercial terms · Round {activeRound.id}</div>
          <div className="text-[11px] text-muted-foreground">{editable ? "Edit current-round values, then mark each as agreed" : "Read-only"}</div>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/10 text-left">
              <th className="px-3 py-2 font-semibold text-foreground">Term</th>
              <th className="px-3 py-2 font-semibold text-foreground">Opening (vendor)</th>
              <th className="px-3 py-2 font-semibold text-foreground">Target (buyer)</th>
              <th className="px-3 py-2 font-semibold text-foreground">This round</th>
              <th className="px-3 py-2 text-right font-semibold text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => {
              const opening = negotiation.openingTerms.find((t) => t.key === k)?.value ?? "—";
              const target = negotiation.targetTerms.find((t) => t.key === k)?.value ?? "—";
              const current = currentTerms.find((t) => t.key === k);
              const agreed = current?.agreed;
              const options = TERM_OPTIONS[k];
              return (
                <tr key={k} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-medium text-foreground">{TERM_LABELS[k]}</td>
                  <td className="px-3 py-2 text-muted-foreground">{opening}</td>
                  <td className="px-3 py-2 text-muted-foreground">{target}</td>
                  <td className="px-3 py-2">
                    {editable && !agreed ? (
                      options ? (
                        <select
                          value={current?.value ?? ""}
                          onChange={(e) => updateTerm(k, { value: e.target.value })}
                          className="w-44 rounded-md border border-border bg-background px-2 py-1 text-xs outline-none focus:border-accent"
                        >
                          <option value="">Select…</option>
                          {options.map((o) => <option key={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          value={current?.value ?? ""}
                          onChange={(e) => updateTerm(k, { value: e.target.value })}
                          className="w-44 rounded-md border border-border bg-background px-2 py-1 text-xs outline-none focus:border-accent"
                        />
                      )
                    ) : (
                      <span className="font-semibold text-foreground">{current?.value || "—"}</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    {agreed ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[oklch(0.7_0.16_155)]/15 px-2 py-0.5 text-[10px] font-bold text-[oklch(0.5_0.16_155)]">
                        <Check className="h-3 w-3" /> Agreed
                      </span>
                    ) : editable ? (
                      <button
                        onClick={() => updateTerm(k, { agreed: true })}
                        className="rounded-md border border-border bg-background px-2 py-1 text-[10px] font-semibold text-foreground hover:bg-muted"
                      >
                        Mark agreed
                      </button>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">Open</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Evolution stepper */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="border-b border-border bg-muted/30 px-4 py-2.5 text-sm font-bold text-foreground">Evolution across rounds</div>
        <div className="divide-y divide-border">
          {keys.map((k) => (
            <div key={k} className="flex items-center gap-3 px-4 py-2.5 text-xs">
              <div className="w-40 shrink-0 font-medium text-foreground">{TERM_LABELS[k]}</div>
              <div className="flex flex-1 flex-wrap items-center gap-2 text-muted-foreground">
                {negotiation.rounds.map((r) => {
                  const tb = (r.termBids ?? negotiation.openingTerms).find((t) => t.key === k);
                  return (
                    <span key={r.id} className="inline-flex items-center gap-1">
                      <span className="rounded-md border border-border bg-background px-1.5 py-0.5 text-[10px] font-semibold text-foreground">R{r.id}: {tb?.value || "—"}{tb?.agreed ? " ✓" : ""}</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground last:hidden" />
                    </span>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editable && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
          <div className="text-xs text-muted-foreground">{agreedCount} of {keys.length} terms agreed — finalise all before accepting the negotiation.</div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const next = keys.map((k) => {
                  const existing = currentTerms.find((t) => t.key === k) ?? { key: k, value: "" };
                  return { ...existing, agreed: true };
                });
                onUpdate({ ...negotiation, rounds: negotiation.rounds.map((r) => (r.id === activeRound.id ? { ...r, termBids: next } : r)) });
              }}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
            >
              Accept all terms
            </button>
          </div>
        </div>
      )}
    </div>
  );
}





function RowIconBtn({
  label,
  onClick,
  children,
  tone = "default",
  asChild,
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
  tone?: "default" | "accent" | "success";
  asChild?: boolean;
}) {
  const toneCls =
    tone === "accent"
      ? "border-accent/40 bg-accent/10 text-accent hover:bg-accent/20"
      : tone === "success"
        ? "border-[oklch(0.7_0.16_155)]/40 bg-[oklch(0.7_0.16_155)]/10 text-[oklch(0.5_0.16_155)] hover:bg-[oklch(0.7_0.16_155)]/20"
        : "border-border bg-background text-foreground hover:bg-muted";
  const cls = `inline-flex h-8 w-8 items-center justify-center rounded-md border transition ${toneCls}`;
  if (asChild) {
    return (
      <span className="group relative">
        <span className={cls} title={label}>{children}</span>
        <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">{label}</span>
      </span>
    );
  }
  return (
    <span className="group relative">
      <button onClick={onClick} aria-label={label} className={cls}>{children}</button>
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">{label}</span>
    </span>
  );
}


function IconAction({ label, onClick, children }: { label: string; onClick?: () => void; children: React.ReactNode }) {
  return (
    <div className="group relative">
      <button
        onClick={onClick}
        aria-label={label}
        className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 text-accent transition-colors hover:bg-accent/20"
      >
        {children}
      </button>
      <span className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
        {label}
      </span>
    </div>
  );
}


type PillColor = "green" | "red" | "yellow" | "purple" | "gray" | "blue";
function Pill({ color, children }: { color: PillColor; children: React.ReactNode }) {
  const map: Record<PillColor, string> = {
    green: "bg-[oklch(0.7_0.16_155)] text-white",
    red: "bg-[oklch(0.6_0.22_25)] text-white",
    yellow: "bg-[oklch(0.74_0.16_65)] text-white",
    purple: "bg-[oklch(0.62_0.2_300)] text-white",
    blue: "bg-[oklch(0.55_0.18_255)] text-white",
    gray: "bg-muted text-muted-foreground",
  };
  return <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${map[color]}`}>{children}</span>;
}

function statusColor(s: string): PillColor {
  if (s === "Qualified") return "purple";
  if (s === "Under Negotiation") return "purple";
  if (s === "Ready for NFA") return "green";
  if (s === "PO Initiated") return "green";
  if (s === "In Contracting") return "blue";
  if (s === "Pending Verification") return "yellow";
  if (s === "Not Submitted") return "gray";
  return "yellow";
}



function InviteVendorsModal({ onClose }: { onClose: () => void }) {
  const vendors = [
    { status: "Approved", win: "90%", past: "1", sel: false },
    { status: "Approved", win: "90%", past: "1", sel: true },
    { status: "Approved", win: "90%", past: "56", sel: true },
    { status: "Approved", win: "90%", past: "None", sel: false },
    { status: "Pending", win: "68%", past: "None", sel: false },
    { status: "Pending", win: "68%", past: "4", sel: false },
    { status: "Declined", win: "36%", past: "3", sel: false },
  ];
  const sc = (s: string) =>
    s === "Approved"
      ? "text-[oklch(0.55_0.16_155)]"
      : s === "Pending"
        ? "text-[oklch(0.55_0.16_65)]"
        : "text-[oklch(0.55_0.22_25)]";

  return (
    <ModalShell onClose={onClose} width="max-w-2xl">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-bold text-foreground">Invite Vendors</h3>
      </div>
      <div className="space-y-3 px-6 py-5">
        <div className="flex flex-wrap gap-3">
          <SelectField value="Vendor Category" options={["Vendor Category"]} small />
          <SelectField value="All Vendors" options={["All Vendors"]} small />
          <SelectField value="All Statuses" options={["All Statuses"]} small />
          <SelectField value="Win Rate" options={["Win Rate"]} small />
        </div>

        <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
          {vendors.map((v, i) => (
            <label
              key={i}
              className={`grid cursor-pointer grid-cols-[1.5rem_auto_1fr_auto_auto_auto] items-center gap-4 rounded-lg border bg-card px-4 py-3 ${
                v.sel ? "border-accent ring-1 ring-accent" : "border-border"
              }`}
            >
              <input type="checkbox" defaultChecked={v.sel} className="h-4 w-4 rounded border-border" />
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">DT</span>
              <div>
                <div className="text-sm font-bold text-foreground">Dell Technologies</div>
                <div className="text-xs text-muted-foreground">IT Hardware, New York</div>
              </div>
              <div className="text-xs">
                <div className="text-muted-foreground">Status</div>
                <div className={`font-semibold ${sc(v.status)}`}>{v.status}</div>
              </div>
              <div className="text-xs">
                <div className="text-muted-foreground">Win rate</div>
                <div className={`font-semibold ${v.win === "36%" ? "text-[oklch(0.55_0.22_25)]" : v.win === "68%" ? "text-[oklch(0.55_0.16_65)]" : "text-foreground"}`}>{v.win}</div>
              </div>
              <div className="text-xs">
                <div className="text-muted-foreground">Past event</div>
                <div className="font-semibold text-foreground">{v.past}</div>
              </div>
            </label>
          ))}

          <button className="flex w-full items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left hover:bg-muted">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[oklch(0.7_0.16_155)] text-white">
              <UserPlus className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-sm font-bold text-foreground">Invite vendor not in the system</span>
              <span className="block text-xs text-muted-foreground">Send an external invitation link to onboard...</span>
            </span>
          </button>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 border-t border-border px-6 py-4">
        <button onClick={onClose} className="text-sm font-semibold text-foreground hover:underline">Cancel</button>
        <button onClick={onClose} className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Invite Vendors
        </button>
      </div>
    </ModalShell>
  );
}

function AddSubmissionModal({ onClose }: { onClose: () => void }) {
  const vendors = Array.from(new Set(VENDORS.map((v) => v.name)));
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <ModalShell onClose={onClose} width="max-w-lg">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-bold text-foreground">Add Submission</h3>
      </div>
      <div className="space-y-5 px-6 py-5">
        <Field label="Vendor">
          <SelectField value={vendors[0]} options={vendors} />
        </Field>

        <Field label="Submission file">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                setFileName(e.dataTransfer.files[0].name);
              }
            }}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 transition ${
              dragOver ? "border-accent bg-accent/5" : "border-border bg-muted/30"
            }`}
          >
            <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">
              {fileName ? fileName : "Drag & drop a file here"}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              {fileName ? "File selected" : "or click to browse (PDF, XLSX, DOCX)"}
            </span>
            <input
              type="file"
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setFileName(e.target.files[0].name);
                }
              }}
            />
          </div>
        </Field>
      </div>
      <div className="flex items-center justify-end gap-4 border-t border-border px-6 py-4">
        <button onClick={onClose} className="text-sm font-semibold text-foreground hover:underline">Cancel</button>
        <button onClick={onClose} className="rounded-md bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          Add Submission
        </button>
      </div>
    </ModalShell>
  );
}

/* ---------------- Vendor Comparison Modal ---------------- */

const CMP_VENDORS = [
  { name: "Dell Technologies", score: 65, met: 43, total: 45, tone: "amber" as const },
  { name: "Lenovo Group", score: 100, met: 43, total: 45, tone: "green" as const },
  { name: "HP Inc.", score: 65, met: 43, total: 45, tone: "amber" as const },
];

const CMP_REQS = [
  { req: "Must be a standard 32 fl oz volume HDPE bottle, suitable for industrial liquid packaging.", pct: 65, tone: "amber" as const, note: "Full compliance with all HDPE boilers" },
  { req: "Must be designed for compatibility with existing filling and capping machinery at Plant 19.", pct: 45, tone: "red" as const, note: "Volume: 32 fl oz =1% … PolyPak" },
  { req: "Volume Accuracy: 32 fl oz +/- 1%", pct: 99, tone: "green" as const, note: "Drop Test: 5-foot drop (full) AST" },
  { req: "Must be a standard 32 fl oz volume HDPE bottle, suitable for industrial liquid packaging.", pct: 65, tone: "amber" as const, note: "Full compliance with all HDPE boilers" },
  { req: "Must be a standard 32 fl oz volume HDPE bottle, suitable for industrial liquid packaging.", pct: 45, tone: "red" as const, note: "Leakage Rate: Max 0.1% of bacteria" },
  { req: "Must be a standard 32 fl oz volume HDPE bottle, suitable for industrial liquid packaging.", pct: 99, tone: "green" as const, note: "Drop Test: 5-foot drop (full) AST" },
];

// Per-vendor unit prices per line item (mocked) — keys are vendor names from CMP_VENDORS
const CMP_PRICE_ITEMS: { id: string; name: string; spec?: string; qty: number; unit: string; prices: Record<string, number> }[] = [
  { id: "p1", name: "Carbon Steel Sheet", spec: "3mm · 1m × 2m", qty: 600, unit: "sheet", prices: { "Dell Technologies": 28, "Lenovo Group": 26.5, "HP Inc.": 29 } },
  { id: "p2", name: "Carbon Steel Sheet", spec: "5mm · 1m × 2m", qty: 400, unit: "sheet", prices: { "Dell Technologies": 71, "Lenovo Group": 68, "HP Inc.": 73.5 } },
  { id: "p3", name: "SS Rod", spec: "10mm × 3m", qty: 300, unit: "rod", prices: { "Dell Technologies": 38, "Lenovo Group": 36.5, "HP Inc.": 40 } },
  { id: "p4", name: "SS Rod", spec: "14mm × 3m", qty: 200, unit: "rod", prices: { "Dell Technologies": 94, "Lenovo Group": 89, "HP Inc.": 98 } },
];

function toneText(t: "green" | "amber" | "red") {
  return t === "green" ? "text-[oklch(0.6_0.16_155)]" : t === "amber" ? "text-[oklch(0.7_0.16_70)]" : "text-[oklch(0.6_0.22_25)]";
}

function VendorComparisonModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"scoring" | "price">("scoring");

  // Vendor totals for price tab
  const vendorTotals = CMP_VENDORS.map((v) => ({
    name: v.name,
    total: CMP_PRICE_ITEMS.reduce((s, it) => s + (it.prices[v.name] ?? 0) * it.qty, 0),
  }));
  const lowestTotal = Math.min(...vendorTotals.map((v) => v.total));
  const highestTotal = Math.max(...vendorTotals.map((v) => v.total));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-6">
      <div className="my-4 w-full max-w-[1280px] rounded-2xl bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sourcing</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold text-foreground">IT Hardware RFQ — Q2 2026</span>
          </div>
          <button onClick={onClose} className="rounded-md p-2 hover:bg-muted"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex items-center gap-8 border-b border-border px-6 text-sm">
          {["Vendor submissions", "Vendor comparison", "Vendor pool", "Purchase requisitions", "Final request for proposal", "Evaluation criteria"].map((t, i) => (
            <button key={t} className={`relative py-3 ${i === 1 ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
              {i === 1 && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent" />}
            </button>
          ))}
        </div>

        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Compare Vendors</h2>
            <div className="flex items-center gap-3">
              <input placeholder="Search vendors" className="w-56 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
              <button className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted">Export Comparison</button>
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">Add Vendor</button>
            </div>
          </div>

          {/* Section tabs */}
          <div className="mb-4 inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 p-1">
            <SubTab active={tab === "scoring"} onClick={() => setTab("scoring")}>
              <span className="inline-flex items-center gap-1.5"><CircleCheck className="h-3.5 w-3.5" /> Scoring Comparison</span>
            </SubTab>
            <SubTab active={tab === "price"} onClick={() => setTab("price")}>
              <span className="inline-flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> Price Comparison</span>
            </SubTab>
          </div>

          {tab === "scoring" ? (
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="grid grid-cols-[2fr_repeat(3,1fr)] border-b border-border bg-card">
                <div />
                {CMP_VENDORS.map((v, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 px-4 py-5">
                    <div className="h-14 w-14 rounded-full bg-muted" />
                    <div className="font-bold text-foreground">{v.name}</div>
                    <div className="flex gap-8 text-xs text-muted-foreground">
                      <div className="text-center">
                        <div>Avg. score</div>
                        <div className={`mt-1 text-base font-bold ${toneText(v.tone)}`}>{v.score}%</div>
                      </div>
                      <div className="text-center">
                        <div>Items met</div>
                        <div className="mt-1 text-base font-bold text-foreground">{v.met} / {v.total}</div>
                      </div>
                    </div>
                    <button className="mt-1 rounded-md border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted">Generate Inquiry</button>
                  </div>
                ))}
              </div>

              {[0, 1].map((groupIdx) => (
                <div key={groupIdx}>
                  <div className="flex items-center justify-between bg-muted/40 px-4 py-2">
                    <span className="text-sm font-bold text-foreground">Technical requirements</span>
                    <ArrowDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                  {CMP_REQS.map((r, i) => (
                    <div key={i} className="grid grid-cols-[2fr_repeat(3,1fr)] border-t border-border text-sm">
                      <div className="px-4 py-3 text-foreground">{r.req}</div>
                      {CMP_VENDORS.map((_, vi) => (
                        <div key={vi} className="px-4 py-3">
                          <div className={`flex items-center gap-1.5 font-bold ${toneText(r.tone)}`}>
                            {r.tone === "green" ? <CircleCheck className="h-4 w-4" /> : r.tone === "amber" ? <AlertCircle className="h-4 w-4" /> : <Diamond className="h-4 w-4" />}
                            <span>{r.pct}%</span>
                          </div>
                          <div className="mt-1 text-xs text-muted-foreground">{r.note}</div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              {/* Vendor header strip */}
              <div className="grid grid-cols-[2fr_repeat(3,1fr)] border-b border-border bg-card">
                <div />
                {CMP_VENDORS.map((v) => {
                  const t = vendorTotals.find((x) => x.name === v.name)!;
                  const isLowest = t.total === lowestTotal;
                  const deltaPct = ((t.total - lowestTotal) / lowestTotal) * 100;
                  return (
                    <div key={v.name} className="flex flex-col items-center gap-2 px-4 py-5">
                      <div className="h-14 w-14 rounded-full bg-muted" />
                      <div className="font-bold text-foreground">{v.name}</div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground">Total bid</div>
                        <div className={`mt-1 text-base font-bold ${isLowest ? "text-[oklch(0.55_0.16_155)]" : "text-foreground"}`}>${t.total.toLocaleString()}</div>
                      </div>
                      {isLowest ? (
                        <span className="rounded-full bg-[oklch(0.7_0.16_155)]/15 px-2 py-0.5 text-[10px] font-bold text-[oklch(0.55_0.16_155)]">Lowest</span>
                      ) : (
                        <span className="rounded-full bg-[oklch(0.6_0.22_25)]/10 px-2 py-0.5 text-[10px] font-bold text-[oklch(0.55_0.22_25)]">+{deltaPct.toFixed(1)}%</span>
                      )}
                      <button className="mt-1 rounded-md border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:bg-muted">Generate Inquiry</button>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between bg-muted/40 px-4 py-2">
                <span className="text-sm font-bold text-foreground">Line items</span>
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
              </div>
              {CMP_PRICE_ITEMS.map((it) => {
                const rowPrices = CMP_VENDORS.map((v) => it.prices[v.name] ?? 0);
                const rowMin = Math.min(...rowPrices);
                return (
                  <div key={it.id} className="grid grid-cols-[2fr_repeat(3,1fr)] border-t border-border text-sm">
                    <div className="px-4 py-3">
                      <div className="font-medium text-foreground">{it.name}</div>
                      {it.spec && <div className="text-xs text-muted-foreground">{it.spec} · {it.qty} {it.unit}</div>}
                    </div>
                    {CMP_VENDORS.map((v) => {
                      const unit = it.prices[v.name] ?? 0;
                      const lineTotal = unit * it.qty;
                      const isBest = unit === rowMin;
                      const dPct = ((unit - rowMin) / rowMin) * 100;
                      return (
                        <div key={v.name} className="px-4 py-3">
                          <div className={`font-bold ${isBest ? "text-[oklch(0.55_0.16_155)]" : "text-foreground"}`}>
                            ${unit.toLocaleString()}<span className="ml-1 text-[10px] font-medium text-muted-foreground">/{it.unit}</span>
                          </div>
                          <div className="mt-0.5 text-xs text-muted-foreground">${lineTotal.toLocaleString()} total</div>
                          {isBest ? (
                            <div className="mt-1 text-[10px] font-bold text-[oklch(0.55_0.16_155)]">↓ Best price</div>
                          ) : (
                            <div className="mt-1 text-[10px] font-bold text-[oklch(0.55_0.22_25)]">+{dPct.toFixed(1)}%</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {/* Footer total row */}
              <div className="grid grid-cols-[2fr_repeat(3,1fr)] border-t border-border bg-muted/30 text-sm">
                <div className="px-4 py-3 font-bold text-foreground">Total bid value</div>
                {CMP_VENDORS.map((v) => {
                  const t = vendorTotals.find((x) => x.name === v.name)!;
                  const isLowest = t.total === lowestTotal;
                  return (
                    <div key={v.name} className="px-4 py-3">
                      <div className={`text-base font-bold ${isLowest ? "text-[oklch(0.55_0.16_155)]" : "text-foreground"}`}>${t.total.toLocaleString()}</div>
                      {isLowest && <span className="mt-1 inline-block rounded-full bg-[oklch(0.7_0.16_155)]/15 px-2 py-0.5 text-[10px] font-bold text-[oklch(0.55_0.16_155)]">Best price</span>}
                    </div>
                  );
                })}
              </div>
              <div className="grid grid-cols-[2fr_repeat(3,1fr)] border-t border-border text-xs">
                <div className="px-4 py-2 text-muted-foreground">Indicative savings vs highest</div>
                {CMP_VENDORS.map((v) => {
                  const t = vendorTotals.find((x) => x.name === v.name)!;
                  const save = highestTotal - t.total;
                  return (
                    <div key={v.name} className="px-4 py-2 text-muted-foreground">
                      {save > 0 ? `$${save.toLocaleString()} saved` : "—"}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




/* ---------------- Award PO Modal (multi-PO) ---------------- */

// Event-level RFP line items used by the award flow
const EVENT_LINE_ITEMS: LineItem[] = [
  { id: "li1", name: "Carbon Steel Sheet", spec: "3mm · 1m × 2m", qty: 600, unit: "sheet", openingUnitPrice: 30, targetUnitPrice: 26 },
  { id: "li2", name: "Carbon Steel Sheet", spec: "5mm · 1m × 2m", qty: 400, unit: "sheet", openingUnitPrice: 75.5, targetUnitPrice: 65 },
  { id: "li3", name: "SS Rod", spec: "10mm × 3m", qty: 300, unit: "rod", openingUnitPrice: 40, targetUnitPrice: 36 },
];

type DraftAllocation = {
  rowId: string;
  itemId: string;
  vendor: string;
  qty: number;
};

function vendorUnitPriceFor(vendor: string, itemId: string, negotiations: Negotiation[]): number {
  // Look for a negotiation by this vendor that includes the item
  for (const n of negotiations) {
    if (n.vendor !== vendor) continue;
    const item = n.items.find((i) => i.id === itemId || i.name === EVENT_LINE_ITEMS.find((e) => e.id === itemId)?.name);
    if (!item) continue;
    const latest = n.rounds[n.rounds.length - 1];
    const lb = latest.lineBids.find((b) => b.itemId === item.id);
    if (lb) return lb.unitPrice;
  }
  return EVENT_LINE_ITEMS.find((e) => e.id === itemId)?.openingUnitPrice ?? 0;
}

function AwardPoModal({
  initialVendor,
  eligibleVendors,
  negotiations,
  onClose,
  onConfirm,
}: {
  initialVendor: string;
  eligibleVendors: string[];
  negotiations: Negotiation[];
  onClose: () => void;
  onConfirm: (pos: PurchaseOrder[]) => void;
}) {
  const vendorOptions = useMemo(
    () => Array.from(new Set([initialVendor, ...eligibleVendors])),
    [initialVendor, eligibleVendors],
  );

  const [rows, setRows] = useState<DraftAllocation[]>(
    () => EVENT_LINE_ITEMS.map((it) => ({ rowId: `r-${it.id}`, itemId: it.id, vendor: initialVendor, qty: it.qty })),
  );
  const [deliveryDate, setDeliveryDate] = useState("");
  const [shipTo, setShipTo] = useState("Plant 19 — Pittsburgh, PA");
  const [notes, setNotes] = useState("");

  function updateRow(rowId: string, patch: Partial<DraftAllocation>) {
    setRows((rs) => rs.map((r) => (r.rowId === rowId ? { ...r, ...patch } : r)));
  }
  function splitRow(rowId: string) {
    setRows((rs) => {
      const idx = rs.findIndex((r) => r.rowId === rowId);
      if (idx < 0) return rs;
      const r = rs[idx];
      const half = Math.floor(r.qty / 2);
      const a = { ...r, qty: r.qty - half };
      const b = { ...r, rowId: `r-${r.itemId}-${Date.now()}`, qty: half, vendor: vendorOptions.find((v) => v !== r.vendor) ?? r.vendor };
      const next = [...rs];
      next.splice(idx, 1, a, b);
      return next;
    });
  }
  function removeRow(rowId: string) {
    setRows((rs) => rs.filter((r) => r.rowId !== rowId));
  }

  // Group preview by vendor → one PO per vendor
  const poGroups = useMemo(() => {
    const map = new Map<string, { vendor: string; lines: { item: LineItem; qty: number; unitPrice: number }[] }>();
    for (const r of rows) {
      if (r.qty <= 0) continue;
      const item = EVENT_LINE_ITEMS.find((e) => e.id === r.itemId);
      if (!item) continue;
      const unitPrice = vendorUnitPriceFor(r.vendor, r.itemId, negotiations);
      const g = map.get(r.vendor) ?? { vendor: r.vendor, lines: [] };
      g.lines.push({ item, qty: r.qty, unitPrice });
      map.set(r.vendor, g);
    }
    return Array.from(map.values()).map((g, i) => ({
      ...g,
      poNumber: `PO-2026-${String(41 + i).padStart(4, "0")}`,
      total: g.lines.reduce((s, l) => s + l.qty * l.unitPrice, 0),
    }));
  }, [rows, negotiations]);

  // Allocation validation per item — sum of qty must equal item total qty
  const allocationIssues = EVENT_LINE_ITEMS.map((it) => {
    const sum = rows.filter((r) => r.itemId === it.id).reduce((s, r) => s + (Number.isFinite(r.qty) ? r.qty : 0), 0);
    return { item: it, sum, ok: sum === it.qty };
  }).filter((x) => !x.ok);

  function generate() {
    const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const pos: PurchaseOrder[] = poGroups.map((g) => ({
      id: g.poNumber,
      vendor: g.vendor,
      total: g.total,
      createdAt: now,
      deliveryDate: deliveryDate || undefined,
      shipTo: shipTo || undefined,
      notes: notes || undefined,
      allocations: g.lines.map((l) => ({
        itemId: l.item.id,
        itemName: l.item.name,
        itemSpec: l.item.spec,
        qty: l.qty,
        unit: l.item.unit,
        unitPrice: l.unitPrice,
      })),
    }));
    onConfirm(pos);
  }

  return (
    <ModalShell onClose={onClose} width="max-w-5xl">
      <div className="flex items-start justify-between border-b border-border px-6 py-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Award &amp; Initiate Purchase Orders</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Allocate line items across one or more vendors. Each vendor receives its own PO.</p>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-4 w-4" /></button>
      </div>

      <div className="space-y-5 px-6 py-5">
        {/* Award split table */}
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
            <div className="text-xs font-semibold text-foreground">Award split</div>
            <div className="text-[11px] text-muted-foreground">Tip: use Split to award a single line across two vendors</div>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/10 text-left">
                <th className="px-3 py-2 font-semibold text-foreground">Item</th>
                <th className="px-3 py-2 font-semibold text-foreground">Vendor</th>
                <th className="px-3 py-2 text-right font-semibold text-foreground">Allocated qty</th>
                <th className="px-3 py-2 text-right font-semibold text-foreground">Unit price</th>
                <th className="px-3 py-2 text-right font-semibold text-foreground">Line total</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const item = EVENT_LINE_ITEMS.find((e) => e.id === r.itemId)!;
                const unit = vendorUnitPriceFor(r.vendor, r.itemId, negotiations);
                const sameItemCount = rows.filter((rr) => rr.itemId === r.itemId).length;
                return (
                  <tr key={r.rowId} className="border-b border-border last:border-0">
                    <td className="px-3 py-2">
                      <div className="font-medium text-foreground">{item.name}</div>
                      {item.spec && <div className="text-[10px] text-muted-foreground">{item.spec} · total qty {item.qty} {item.unit}</div>}
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={r.vendor}
                        onChange={(e) => updateRow(r.rowId, { vendor: e.target.value })}
                        className="rounded-md border border-border bg-background px-2 py-1 text-xs outline-none focus:border-accent"
                      >
                        {vendorOptions.map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <input
                        type="number"
                        value={r.qty}
                        onChange={(e) => updateRow(r.rowId, { qty: Number(e.target.value) || 0 })}
                        className="w-24 rounded-md border border-border bg-background px-2 py-1 text-right text-xs outline-none focus:border-accent"
                      />
                      <span className="ml-1 text-[10px] text-muted-foreground">{item.unit}</span>
                    </td>
                    <td className="px-3 py-2 text-right text-foreground">${unit.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right font-semibold text-foreground">${(unit * r.qty).toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => splitRow(r.rowId)} className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[10px] font-semibold text-foreground hover:bg-muted">
                          <Split className="h-3 w-3" /> Split
                        </button>
                        {sameItemCount > 1 && (
                          <button onClick={() => removeRow(r.rowId)} className="rounded-md border border-border bg-background p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Remove">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {allocationIssues.length > 0 && (
          <div className="rounded-lg border border-[oklch(0.6_0.22_25)]/40 bg-[oklch(0.6_0.22_25)]/5 px-3 py-2 text-xs text-[oklch(0.5_0.22_25)]">
            <span className="font-semibold">Allocation mismatch:</span>{" "}
            {allocationIssues.map((x) => `${x.item.name} (allocated ${x.sum} of ${x.item.qty})`).join(", ")}
          </div>
        )}

        {/* PO grouping preview */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground">PO preview</h4>
            <span className="text-[11px] text-muted-foreground">{poGroups.length} PO{poGroups.length !== 1 ? "s" : ""} will be generated</span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {poGroups.map((g) => (
              <div key={g.poNumber} className="rounded-xl border border-border bg-muted/20 p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-bold text-foreground">{g.poNumber}</div>
                  <Pill color="green">Draft</Pill>
                </div>
                <div className="mt-0.5 text-xs text-muted-foreground">{g.vendor} · {g.lines.length} line{g.lines.length > 1 ? "s" : ""}</div>
                <div className="mt-2 space-y-1 text-[11px] text-foreground">
                  {g.lines.map((l, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="truncate text-muted-foreground">{l.item.name}{l.item.spec ? ` (${l.item.spec})` : ""} · {l.qty}</span>
                      <span className="font-semibold">${(l.qty * l.unitPrice).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-end justify-between border-t border-border pt-2">
                  <span className="text-[11px] text-muted-foreground">Total</span>
                  <span className="text-base font-bold text-foreground">${g.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common PO fields */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Required delivery date</label>
            <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Ship-to</label>
            <input value={shipTo} onChange={(e) => setShipTo(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
        <button onClick={onClose} className="text-sm font-semibold text-foreground hover:underline">Cancel</button>
        <button onClick={onClose} className="rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted">Save draft</button>
        <button
          onClick={generate}
          disabled={allocationIssues.length > 0 || poGroups.length === 0}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" /> Generate {poGroups.length} PO{poGroups.length !== 1 ? "s" : ""}
        </button>
      </div>
    </ModalShell>
  );
}

/* ---------------- Start Contracting Modal ---------------- */

function StartContractModal({
  vendor,
  onClose,
  onConfirm,
}: {
  vendor: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [contractType, setContractType] = useState("MSA");
  const [validity, setValidity] = useState("12 months");
  const [notes, setNotes] = useState("");

  return (
    <ModalShell onClose={onClose} width="max-w-lg">
      <div className="flex items-start justify-between border-b border-border px-6 py-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Start Contracting</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Send the finalised terms to Legal to draft the contract.</p>
        </div>
        <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-4 w-4" /></button>
      </div>

      <div className="space-y-4 px-6 py-5">
        <div className="rounded-lg border border-border bg-muted/20 p-3 text-sm">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Vendor</div>
          <div className="mt-0.5 font-bold text-foreground">{vendor}</div>
        </div>

        <Field label="Contract type">
          <select value={contractType} onChange={(e) => setContractType(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent">
            <option>MSA — Master Service Agreement</option>
            <option>SOW — Statement of Work</option>
            <option>Framework Agreement</option>
            <option>One-time Purchase Agreement</option>
          </select>
        </Field>

        <Field label="Validity period">
          <select value={validity} onChange={(e) => setValidity(e.target.value)} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent">
            <option>6 months</option>
            <option>12 months</option>
            <option>24 months</option>
            <option>36 months</option>
          </select>
        </Field>

        <Field label="Notes to Legal">
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Reference final agreed price and terms…" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent" />
        </Field>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
        <button onClick={onClose} className="text-sm font-semibold text-foreground hover:underline">Cancel</button>
        <button onClick={onConfirm} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
          <FileSignature className="h-4 w-4" /> Send to Legal
        </button>
      </div>
    </ModalShell>
  );
}




/* ---------------- shared display helpers ---------------- */

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

function ScoreLabel({ value, kind }: { value: number | null; kind: "risk" | "perf" }) {
  if (value === null || value === undefined) {
    return <span className="text-xs italic text-muted-foreground">N/A — not yet rated</span>;
  }
  let label = "Low";
  let color = "oklch(0.62 0.16 155)";
  if (kind === "risk") {
    if (value >= 67) { label = "High"; color = "oklch(0.6 0.22 25)"; }
    else if (value >= 34) { label = "Medium"; color = "oklch(0.74 0.16 65)"; }
  } else {
    if (value < 50) { label = "Low"; color = "oklch(0.6 0.22 25)"; }
    else if (value < 75) { label = "Medium"; color = "oklch(0.74 0.16 65)"; }
    else { label = "High"; }
  }
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-foreground">{value}</span>
      <span className="text-[10px] font-medium uppercase tracking-wide" style={{ color }}>{label}</span>
    </div>
  );
}
