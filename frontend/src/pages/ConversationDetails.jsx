import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getConversation } from "../api/api.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import SummaryCard from "../components/SummaryCard.jsx";

export default function ConversationDetails() {
  const { id } = useParams();
  const [conversation, setConversation] = useState(null);
  useEffect(() => { getConversation(id).then(setConversation); }, [id]);
  if (!conversation) return <LoadingSpinner label="Opening conversation" />;
  const summary = conversation.summary_full || {};
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">{conversation.title}</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{conversation.conversation_type} · {new Date(conversation.created_at).toLocaleString()}</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <SummaryCard title="Short Summary">{summary.short_summary}</SummaryCard>
        <SummaryCard title="Decisions"><pre className="whitespace-pre-wrap font-sans">{summary.decisions}</pre></SummaryCard>
        <SummaryCard title="Deadlines"><pre className="whitespace-pre-wrap font-sans">{summary.deadlines}</pre></SummaryCard>
      </div>
      <SummaryCard title="Detailed Summary">{summary.detailed_summary}</SummaryCard>
      <div className="grid gap-4 lg:grid-cols-2">
        <SummaryCard title="Key Points"><pre className="whitespace-pre-wrap font-sans">{summary.key_points}</pre></SummaryCard>
        <SummaryCard title="Advice, Risks, Opportunities"><pre className="whitespace-pre-wrap font-sans">{[summary.advice, summary.risks, summary.opportunities].filter(Boolean).join("\n\n")}</pre></SummaryCard>
      </div>
      <div className="glass card p-5">
        <h2 className="mb-3 text-lg font-semibold">Transcript</h2>
        <p className="whitespace-pre-wrap text-sm leading-7 text-gray-700 dark:text-gray-200">{conversation.transcript?.text || "No transcript text available."}</p>
      </div>
    </div>
  );
}
