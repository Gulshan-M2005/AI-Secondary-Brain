import { useEffect, useRef } from "react";

export default function WaveformVisualizer({ analyser, active }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let frame;
    const data = new Uint8Array(analyser?.frequencyBinCount || 64);

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(108, 99, 255, 0.08)";
      ctx.fillRect(0, 0, width, height);
      if (active && analyser) analyser.getByteTimeDomainData(data);
      const bars = active && analyser ? data : new Uint8Array(64).map((_, i) => 128 + Math.sin(i) * 12);
      const barWidth = width / bars.length;
      ctx.strokeStyle = active ? "#00D4FF" : "#8B5CF6";
      ctx.lineWidth = 3;
      ctx.beginPath();
      bars.forEach((value, index) => {
        const y = (value / 255) * height;
        const x = index * barWidth;
        if (index === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [analyser, active]);

  return <canvas ref={canvasRef} width="900" height="220" className="h-48 w-full rounded-lg border border-white/70 bg-white/50 dark:border-white/10 dark:bg-white/5" />;
}
