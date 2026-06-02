export default function SummaryCard({ title, children }) {
  return (
    <div className="glass card p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-normal text-gray-500 dark:text-gray-400">{title}</h3>
      <div className="text-sm leading-6 text-gray-700 dark:text-gray-200">{children || "No data yet."}</div>
    </div>
  );
}
