import { Link } from "react-router-dom";
import { Calendar, Clock, Tag } from "lucide-react";

export default function ConversationCard({ conversation }) {
  const minutes = Math.round((conversation.duration_seconds || 0) / 60);
  return (
    <Link to={`/library/${conversation.id}`} className="glass card block p-5 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold text-gray-950 dark:text-white">{conversation.title}</div>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">{conversation.conversation_type}</div>
        </div>
        <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
          {conversation.has_transcript ? "Transcribed" : "Draft"}
        </span>
      </div>
      <p className="line-clamp-2 min-h-10 text-sm text-gray-600 dark:text-gray-300">{conversation.summary || "No summary generated yet."}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span className="inline-flex items-center gap-1"><Calendar size={14} /> {new Date(conversation.created_at).toLocaleDateString()}</span>
        <span className="inline-flex items-center gap-1"><Clock size={14} /> {minutes} min</span>
        {conversation.tags && <span className="inline-flex items-center gap-1"><Tag size={14} /> {conversation.tags}</span>}
      </div>
    </Link>
  );
}
