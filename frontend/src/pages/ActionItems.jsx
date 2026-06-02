import { useEffect, useState } from "react";
import { getActions } from "../api/api.js";
import ActionItemCard from "../components/ActionItemCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function ActionItems() {
  const [items, setItems] = useState(null);
  const load = () => getActions().then(setItems);
  useEffect(() => { load(); }, []);
  if (!items) return <LoadingSpinner label="Loading action items" />;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Action Items</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Tasks, deadlines, assignments, and follow-ups detected from transcripts.</p>
      </div>
      <div className="grid gap-3">
        {items.map((item) => <ActionItemCard key={item.id} item={item} onChange={load} />)}
      </div>
    </div>
  );
}
