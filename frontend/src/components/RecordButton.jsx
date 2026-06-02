import { Mic, Pause, Play, Square } from "lucide-react";

export default function RecordButton({ status, onStart, onPause, onResume, onStop, disabled }) {
  if (status === "recording") {
    return (
      <div className="flex flex-wrap gap-3">
        <button onClick={onPause} className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-semibold dark:border-white/10 dark:bg-white/10"><Pause size={18} /> Pause</button>
        <button onClick={onStop} className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white"><Square size={18} /> Stop</button>
      </div>
    );
  }
  if (status === "paused") {
    return (
      <div className="flex flex-wrap gap-3">
        <button onClick={onResume} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white"><Play size={18} /> Resume</button>
        <button onClick={onStop} className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white"><Square size={18} /> Stop</button>
      </div>
    );
  }
  return (
    <button disabled={disabled} onClick={onStart} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft disabled:cursor-not-allowed disabled:opacity-50">
      <Mic size={18} />
      Start Recording
    </button>
  );
}
