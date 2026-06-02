import { useEffect, useState } from "react";
import { getSettings } from "../api/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function Settings() {
  const [settings, setSettings] = useState(null);
  useEffect(() => { getSettings().then(setSettings); }, []);
  if (!settings) return <LoadingSpinner label="Loading settings" />;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Settings</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Local runtime paths and model configuration.</p>
      </div>
      <div className="glass card divide-y divide-gray-200 p-5 dark:divide-white/10">
        {Object.entries(settings).filter(([key]) => key !== "custom").map(([key, value]) => (
          <div key={key} className="grid gap-2 py-3 md:grid-cols-3">
            <div className="text-sm font-semibold capitalize">{key.replaceAll("_", " ")}</div>
            <div className="break-all text-sm text-gray-600 dark:text-gray-300 md:col-span-2">{String(value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
