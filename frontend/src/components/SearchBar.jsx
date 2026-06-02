import { Search } from "lucide-react";

export default function SearchBar({ value, onChange, onSubmit, placeholder = "Search memory" }) {
  return (
    <form onSubmit={onSubmit} className="glass card flex items-center gap-3 p-2">
      <Search className="ml-3 text-gray-400" size={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
      <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Search</button>
    </form>
  );
}
