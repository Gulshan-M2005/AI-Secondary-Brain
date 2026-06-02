import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.theme === "dark");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.theme = dark ? "dark" : "light";
  }, [dark]);
  return (
    <button
      onClick={() => setDark((value) => !value)}
      className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 bg-white text-gray-700 dark:border-white/10 dark:bg-white/10 dark:text-white"
      title="Toggle theme"
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
