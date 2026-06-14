import { useEffect } from "react";
import { X, ArrowRight, AlertTriangle } from "lucide-react";

export type JourneyStageStatus = "complete" | "current" | "upcoming" | "error";

export type JourneyStage = {
  id: string;
  title: string;
  description: string;
  status: JourneyStageStatus;
  /** Optional action button rendered on the right of the row */
  action?: { label: string; onClick?: () => void; variant?: "primary" | "danger" };
};

export const DEFAULT_PROCUREMENT_STAGES: JourneyStage[] = [
  { id: "configure", title: "Configure Event", description: "Set scope, items, timeline, and criteria", status: "upcoming" },
  { id: "invite", title: "Invite Suppliers", description: "Select and invite qualified vendors", status: "upcoming" },
  { id: "review", title: "Review Responses", description: "Receive and review supplier submissions", status: "upcoming" },
  { id: "evaluate", title: "Evaluate & Compare", description: "Structured side-by-side comparison", status: "upcoming" },
  { id: "negotiate", title: "Negotiate", description: "Engage with shortlisted suppliers", status: "upcoming" },
  { id: "award", title: "Award & Close", description: "Issue award and trigger downstream process", status: "upcoming" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  stages: JourneyStage[];
};

export function JourneyDrawer({ open, onClose, title = "Procurement Buyer Journey", stages }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* backdrop */}
      <button
        aria-label="Close journey"
        onClick={onClose}
        className={`absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* panel */}
      <aside
        role="dialog"
        aria-label={title}
        className={`absolute right-0 top-0 h-full w-full max-w-[640px] bg-card shadow-2xl ring-1 ring-border transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-7 py-6">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ol className="px-7 pb-8">
          {stages.map((s, i) => {
            const isLast = i === stages.length - 1;
            return (
              <li key={s.id} className="relative grid grid-cols-[36px_1fr_auto] items-start gap-4">
                {/* connector */}
                {!isLast && (
                  <span
                    aria-hidden
                    className={`absolute left-[17px] top-9 h-[calc(100%-12px)] w-0.5 ${
                      s.status === "complete"
                        ? "bg-[oklch(0.62_0.16_155)]"
                        : s.status === "error"
                          ? "bg-[oklch(0.62_0.22_25)]"
                          : s.status === "current"
                            ? "bg-primary"
                            : "bg-border"
                    }`}
                  />
                )}
                <StageBullet index={i + 1} status={s.status} />
                <div className="min-w-0 py-1">
                  <div
                    className={`text-[15px] font-bold ${
                      s.status === "complete"
                        ? "text-[oklch(0.55_0.16_155)]"
                        : s.status === "error"
                          ? "text-[oklch(0.55_0.22_25)]"
                          : s.status === "current"
                            ? "text-primary"
                            : "text-foreground"
                    }`}
                  >
                    {s.title}
                  </div>
                  <div className="text-sm text-muted-foreground">{s.description}</div>
                </div>
                <div className="pt-1">
                  {s.action && (
                    <button
                      onClick={s.action.onClick}
                      className={
                        s.action.variant === "danger"
                          ? "inline-flex items-center gap-2 rounded-full border border-[oklch(0.62_0.22_25)] px-4 py-2 text-sm font-semibold text-[oklch(0.55_0.22_25)] hover:bg-[oklch(0.62_0.22_25)]/5"
                          : "inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                      }
                    >
                      {s.action.variant === "danger" ? <AlertTriangle className="h-4 w-4" /> : null}
                      {s.action.label}
                      {s.action.variant !== "danger" && <ArrowRight className="h-4 w-4" />}
                    </button>
                  )}
                </div>
                {!isLast && <div className="col-span-3 h-3" />}
              </li>
            );
          })}
        </ol>
      </aside>
    </div>
  );
}

function StageBullet({ index, status }: { index: number; status: JourneyStageStatus }) {
  const base = "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold";
  if (status === "complete")
    return <span className={`${base} bg-[oklch(0.62_0.16_155)] text-white`}>{index}</span>;
  if (status === "error")
    return <span className={`${base} bg-[oklch(0.62_0.22_25)] text-white`}>{index}</span>;
  if (status === "current")
    return (
      <span className={`${base} bg-primary text-primary-foreground`}>
        <span className="h-2.5 w-2.5 rounded-full bg-primary-foreground" />
      </span>
    );
  return <span className={`${base} bg-muted text-muted-foreground`}>{index}</span>;
}
