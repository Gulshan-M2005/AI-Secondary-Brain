import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Recorder from "./pages/Recorder.jsx";
import ConversationLibrary from "./pages/ConversationLibrary.jsx";
import ConversationDetails from "./pages/ConversationDetails.jsx";
import MemorySearch from "./pages/MemorySearch.jsx";
import AskMemory from "./pages/AskMemory.jsx";
import ActionItems from "./pages/ActionItems.jsx";
import Reports from "./pages/Reports.jsx";
import Settings from "./pages/Settings.jsx";

export default function App() {
  return (
    <div className="app-shell min-h-screen">
      <Sidebar />
      <main className="min-h-screen lg:pl-72">
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/record" element={<Recorder />} />
            <Route path="/library" element={<ConversationLibrary />} />
            <Route path="/library/:id" element={<ConversationDetails />} />
            <Route path="/memory" element={<MemorySearch />} />
            <Route path="/ask" element={<AskMemory />} />
            <Route path="/actions" element={<ActionItems />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
