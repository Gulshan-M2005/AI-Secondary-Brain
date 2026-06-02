import ChatBox from "../components/ChatBox.jsx";

export default function AskMemory() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Ask Memory</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Answers include supporting transcript sections and confidence.</p>
      </div>
      <ChatBox />
    </div>
  );
}
