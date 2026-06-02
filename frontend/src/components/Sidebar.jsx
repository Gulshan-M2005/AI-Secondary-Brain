import { NavLink } from "react-router-dom";
import { BarChart3, BookOpen, Bot, CheckSquare, FileText, Mic, Search, Settings, Sparkles } from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { to: "/record", label: "Record", icon: Mic },
  { to: "/library", label: "Library", icon: BookOpen },
  { to: "/memory", label: "Search", icon: Search },
  { to: "/ask", label: "Ask Memory", icon: Bot },
  { to: "/actions", label: "Actions", icon: CheckSquare },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/60 bg-white/70 px-5 py-6 backdrop-blur-2xl dark:border-white/10 dark:bg-black/30 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-white shadow-soft">
          <Sparkles size={21} />
        </div>
        <div>
          <div className="text-lg font-semibold">AI Secondary Brain</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Private local memory</div>
        </div>
      </div>
      <nav className="space-y-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-primary text-white shadow-soft"
                  : "text-gray-600 hover:bg-white hover:text-gray-950 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-accent/30 bg-accent/10 p-4 text-xs leading-5 text-gray-700 dark:text-gray-200">
        Please ensure you have permission to record this conversation and comply with local laws.
      </div>
    </aside>
  );
}
