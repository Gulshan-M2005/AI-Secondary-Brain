import { CheckCircle2, Circle } from "lucide-react";
import { updateAction } from "../api/api.js";

export default function ActionItemCard({ item, onChange }) {
  const toggle = async () => {
    await updateAction(item.id, { completed: !item.completed });
    onChange?.();
  };
  return (
    <div className="glass card flex items-start gap-3 p-4">
      <button onClick={toggle} className="mt-0.5 text-primary" title="Toggle complete">
        {item.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
      </button>
      <div className="min-w-0 flex-1">
        <div className={`text-sm font-semibold ${item.completed ? "line-through text-gray-400" : ""}`}>{item.task}</div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
          {item.assignee && <span>Assignee: {item.assignee}</span>}
          {item.deadline && <span>Deadline: {item.deadline}</span>}
          {item.notes && <span>{item.notes}</span>}
        </div>
      </div>
    </div>
  );
}
