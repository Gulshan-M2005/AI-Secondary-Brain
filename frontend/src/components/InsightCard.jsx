export default function InsightCard({ title, value, caption, icon: Icon }) {
  return (
    <div className="glass card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</div>
        {Icon && (
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="text-3xl font-semibold tracking-normal">{value}</div>
      <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{caption}</div>
    </div>
  );
}
