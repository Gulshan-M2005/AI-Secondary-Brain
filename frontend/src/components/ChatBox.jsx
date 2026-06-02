import { Bot, Send } from "lucide-react";
import { useState } from "react";
import { askMemory } from "../api/api.js";
import SourceCard from "./SourceCard.jsx";

export default function ChatBox() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!question.trim()) return;
    const userQuestion = question;
    setQuestion("");
    setMessages((items) => [...items, { role: "user", text: userQuestion }]);
    setLoading(true);
    try {
      const response = await askMemory(userQuestion);
      setMessages((items) => [...items, { role: "assistant", text: response.answer, sources: response.sources, confidence: response.confidence }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass card flex min-h-[620px] flex-col p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <Bot size={18} className="text-primary" />
        Local memory Q&A
      </div>
      <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto">
        {messages.length === 0 && <div className="rounded-lg bg-white/70 p-5 text-sm text-gray-500 dark:bg-white/5 dark:text-gray-400">Ask about saved conversations. Answers are grounded in local transcript chunks.</div>}
        {messages.map((message, index) => (
          <div key={index} className={message.role === "user" ? "ml-auto max-w-2xl rounded-lg bg-primary p-4 text-white" : "max-w-3xl rounded-lg bg-white/80 p-4 dark:bg-white/5"}>
            <div className="text-sm leading-6">{message.text}</div>
            {message.sources?.length > 0 && (
              <div className="mt-4 space-y-3">
                {message.sources.map((source) => <SourceCard key={source.chunk_id} source={source} />)}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-sm text-gray-500">Thinking locally...</div>}
      </div>
      <form onSubmit={submit} className="mt-4 flex items-center gap-2">
        <input value={question} onChange={(event) => setQuestion(event.target.value)} className="h-12 flex-1 rounded-lg border border-gray-200 bg-white px-4 text-sm outline-none focus:border-primary dark:border-white/10 dark:bg-white/10" placeholder="What did we decide about deadlines?" />
        <button className="grid h-12 w-12 place-items-center rounded-lg bg-primary text-white" title="Ask"><Send size={18} /></button>
      </form>
    </div>
  );
}
