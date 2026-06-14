import {
  Bell,
  Database,
  FileText,
  LayoutGrid,
  Menu,
  PencilLine,
  Settings,
  Share2,
  Table as TableIcon,
  Wallet,
  ClipboardList,
} from "lucide-react";

export function AppSidebar() {
  const icons = [
    { Icon: Menu, label: "Menu" },
    { Icon: PencilLine, label: "Compose" },
    { Icon: LayoutGrid, label: "Dashboard" },
    { Icon: Share2, label: "Share" },
    { Icon: TableIcon, label: "Tables" },
    { Icon: Wallet, label: "Wallet" },
    { Icon: ClipboardList, label: "Sourcing", active: true },
    { Icon: Database, label: "Data" },
  ];
  return (
    <aside className="sticky top-0 flex h-screen w-16 shrink-0 flex-col items-center border-r border-border bg-sidebar py-4">
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
