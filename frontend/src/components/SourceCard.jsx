export default function SourceCard({ source }) {
  return (
    <div className="card border border-gray-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold">{source.conversation_title}</div>
        <div className="rounded-md bg-accent/10 px-2 py-1 text-xs font-semibold text-accent">{Math.round((source.score || 0) * 100)}%</div>
      </div>
      <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">{source.text}</p>
    </div>
  );
}
