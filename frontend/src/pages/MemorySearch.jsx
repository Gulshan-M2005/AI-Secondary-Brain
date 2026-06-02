import { useState } from "react";
import { searchMemory } from "../api/api.js";
import SearchBar from "../components/SearchBar.jsx";
import SourceCard from "../components/SourceCard.jsx";

export default function MemorySearch() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("hybrid");
  const [results, setResults] = useState([]);
  const submit = async (event) => {
    event.preventDefault();
    const response = await searchMemory({ query, mode, limit: 12 });
    setResults(response.results);
  };
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Smart Search</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Search transcripts, summaries, decisions, advice, and topics.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {["hybrid", "keyword", "semantic"].map((item) => (
          <button key={item} onClick={() => setMode(item)} className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize ${mode === item ? "bg-primary text-white" : "glass"}`}>{item}</button>
        ))}
      </div>
      <SearchBar value={query} onChange={setQuery} onSubmit={submit} placeholder="Search for deadlines, decisions, people, topics..." />
      <div className="grid gap-3">
        {results.map((source) => <SourceCard key={source.chunk_id} source={source} />)}
      </div>
    </div>
  );
}
