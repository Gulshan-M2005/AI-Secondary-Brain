import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import RecordButton from "../components/RecordButton.jsx";
import WaveformVisualizer from "../components/WaveformVisualizer.jsx";
import { uploadRecording } from "../api/api.js";

const warning = "Please ensure you have permission to record this conversation and comply with local laws.";

export default function Recorder() {
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState("idle");
  const [seconds, setSeconds] = useState(0);
  const [title, setTitle] = useState("Recorded Conversation");
  const [conversationType, setConversationType] = useState("Meeting");
  const [tags, setTags] = useState("");
  const [participants, setParticipants] = useState("");
  const [message, setMessage] = useState("");
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);

  useEffect(() => {
    let timer;
    if (status === "recording") timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [status]);

  const prepareAnalyser = (stream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    audioRef.current = audioContext;
    analyserRef.current = analyser;
  };

  const start = async () => {
    setMessage("");
    chunksRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    prepareAnalyser(stream);
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => event.data.size && chunksRef.current.push(event.data);
    recorder.onstop = async () => {
      setMessage("Saving audio, transcribing locally, and indexing memory...");
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const form = new FormData();
      form.append("file", blob, `recording-${Date.now()}.webm`);
      form.append("title", title);
      form.append("conversation_type", conversationType);
      form.append("participants", participants);
      form.append("tags", tags);
      form.append("duration_seconds", String(seconds));
      const response = await uploadRecording(form);
      setMessage(`Saved conversation #${response.conversation_id}. Transcription status: ${response.transcription_status}`);
      stream.getTracks().forEach((track) => track.stop());
      audioRef.current?.close();
    };
    mediaRef.current = recorder;
    recorder.start();
    setStatus("recording");
    setSeconds(0);
  };

  const pause = () => {
    mediaRef.current?.pause();
    setStatus("paused");
  };
  const resume = () => {
    mediaRef.current?.resume();
    setStatus("recording");
  };
  const stop = () => {
    mediaRef.current?.stop();
    setStatus("processing");
  };

  const time = new Date(seconds * 1000).toISOString().slice(11, 19);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-normal">Recorder</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Capture, transcribe, summarize, and index conversations on this computer.</p>
      </div>
      <div className="glass card p-5">
        <div className="flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/10 p-4">
          <ShieldCheck className="mt-0.5 text-primary" size={22} />
          <div>
            <div className="font-semibold">Consent required before recording</div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{warning}</p>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              I confirm permission has been handled.
            </label>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-white/10" placeholder="Title" />
          <select value={conversationType} onChange={(e) => setConversationType(e.target.value)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-white/10">
            {["Meeting", "Senior Advice", "Class", "Interview", "Brainstorming", "Personal Notes", "Business Discussion", "Research Discussion"].map((type) => <option key={type}>{type}</option>)}
          </select>
          <input value={participants} onChange={(e) => setParticipants(e.target.value)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-white/10" placeholder="Participants" />
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="h-11 rounded-lg border border-gray-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-white/10" placeholder="Tags, comma separated" />
        </div>
      </div>
      <div className="glass card p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
            <div className="text-2xl font-semibold capitalize">{status}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 dark:text-gray-400">Duration</div>
            <div className="text-3xl font-semibold tabular-nums">{time}</div>
          </div>
        </div>
        <WaveformVisualizer analyser={analyserRef.current} active={status === "recording"} />
        <div className="mt-5">
          <RecordButton status={status} disabled={!consent || status === "processing"} onStart={start} onPause={pause} onResume={resume} onStop={stop} />
        </div>
        {message && <div className="mt-4 rounded-lg bg-white/70 p-3 text-sm text-gray-700 dark:bg-white/5 dark:text-gray-200">{message}</div>}
      </div>
    </motion.div>
  );
}
