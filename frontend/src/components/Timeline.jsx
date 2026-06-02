export default function Timeline({ items }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="glass card p-4">
          <div className="text-sm font-semibold">{item.title}</div>
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{new Date(item.date || item.created_at).toLocaleString()} · {item.type || item.conversation_type}</div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{item.summary}</p>
        </div>
      ))}
    </div>
  );
}
