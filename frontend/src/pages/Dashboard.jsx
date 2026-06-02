import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CheckSquare, Clock, FileText, Library } from "lucide-react";
import { motion } from "framer-motion";
import { getDashboard } from "../api/api.js";
import InsightCard from "../components/InsightCard.jsx";
import ConversationCard from "../components/ConversationCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const colors = ["#6C63FF", "#00D4FF", "#10B981", "#F59E0B", "#EF4444"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => {
    getDashboard().then(setData).catch(() => setData(null));
  }, []);
  if (!data) return <LoadingSpinner label="Preparing dashboard" />;
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Your private conversation memory, summarized locally.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InsightCard title="Conversations" value={data.totals.conversations} caption="Saved locally" icon={Library} />
        <InsightCard title="Hours Recorded" value={data.totals.hours_recorded} caption="Across all audio" icon={Clock} />
        <InsightCard title="Transcripts" value={data.totals.transcripts} caption="Indexed for memory" icon={FileText} />
        <InsightCard title="Pending Follow-Ups" value={data.totals.pending_followups} caption={`${data.totals.action_items} total action items`} icon={CheckSquare} />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="glass card p-5 lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Weekly Activity</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weekly_activity}>
                <defs>
                  <linearGradient id="activity" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#6C63FF" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#00D4FF" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.25)" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="conversations" stroke="#6C63FF" fill="url(#activity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass card p-5">
          <h2 className="mb-4 text-lg font-semibold">Topics</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.topic_distribution} innerRadius={60} outerRadius={92} dataKey="value">
                  {data.topic_distribution.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold">Recent Conversations</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.recent_conversations.map((item) => <ConversationCard key={item.id} conversation={item} />)}
        </div>
      </div>
    </motion.div>
  );
}
