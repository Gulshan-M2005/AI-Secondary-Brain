import { Link } from "react-router-dom";
import { Lock, Mic } from "lucide-react";
import ThemeToggle from "./ThemeToggle.jsx";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-white/65 backdrop-blur-2xl dark:border-white/10 dark:bg-black/25">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Lock size={16} className="text-primary" />
          Local-only. No cloud uploads.
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/record" className="inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white shadow-soft">
            <Mic size={16} />
            Start Recording
          </Link>
        </div>
      </div>
    </header>
  );
}
