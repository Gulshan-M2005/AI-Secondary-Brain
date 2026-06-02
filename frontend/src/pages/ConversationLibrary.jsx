import { useEffect, useState } from "react";
import { getConversations } from "../api/api.js";
import ConversationCard from "../components/ConversationCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

export default function ConversationLibrary() {
  const [items, setItems] = useState(null);
  useEffect(() => { getConversations().then(setItems); }, []);
  if (!items) return <LoadingSpinner label="Loading library" />;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Conversation Library</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Browse recorded memories, transcripts, summaries, and action items.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => <ConversationCard key={item.id} conversation={item} />)}
      </div>
    </div>
  );
}
