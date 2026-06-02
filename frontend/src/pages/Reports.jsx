import { useEffect, useState } from "react";
import { generateReport, getConversations, getReports } from "../api/api.js";

export default function Reports() {
  const [conversations, setConversations] = useState([]);
  const [reports, setReports] = useState([]);
  const [conversationId, setConversationId] = useState("");
  const [reportType, setReportType] = useState("Meeting Report");
  const [format, setFormat] = useState("pdf");
  const load = () => Promise.all([getConversations(), getReports()]).then(([c, r]) => { setConversations(c); setReports(r); });
  useEffect(() => { load(); }, []);
  const submit = async (event) => {
    event.preventDefault();
    await generateReport({ report_type: reportType, conversation_id: conversationId ? Number(conversationId) : null, format });
    load();
  };
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Reports</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Generate PDF, TXT, and DOCX reports locally.</p>
      </div>
      <form onSubmit={submit} className="glass card grid gap-4 p-5 md:grid-cols-4">
        <select value={reportType} onChange={(e) => setReportType(e.target.value)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-white/10">
          {["Meeting Report", "Conversation Report", "Action Item Report", "Senior Advice Report", "Knowledge Summary Report", "Weekly Summary Report", "Monthly Summary Report"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={conversationId} onChange={(e) => setConversationId(e.target.value)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-white/10">
          <option value="">All conversations</option>
          {conversations.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}
        </select>
        <select value={format} onChange={(e) => setFormat(e.target.value)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-white/10">
          {["pdf", "txt", "docx"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">Generate</button>
      </form>
      <div className="grid gap-3">
        {reports.map((report) => (
          <div key={report.id} className="glass card p-4">
            <div className="font-semibold">{report.report_type}</div>
            <div className="mt-1 break-all text-sm text-gray-500 dark:text-gray-400">{report.file_path}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
