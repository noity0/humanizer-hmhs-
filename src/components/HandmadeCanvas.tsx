import React, { useState, useRef } from "react";
import { Download, FileImage, FileText, Sliders, RefreshCw, Feather, Coffee, Check, Sparkles, Move } from "lucide-react";
import { jsPDF } from "jspdf";
import { PaperStyle, HandwritingFont, InkColor, HandMadeFileConfig } from "../types";

interface HandmadeCanvasProps {
  initialText: string;
}

export const HandmadeCanvas: React.FC<HandmadeCanvasProps> = ({ initialText }) => {
  const [text, setText] = useState<string>(
    initialText ||
      "Hello! This is a humanized note rendered in authentic handwriting on custom notebook paper. You can adjust pen color, paper texture, handwriting fonts, and download as PDF or PNG image."
  );

  const [config, setConfig] = useState<HandMadeFileConfig>({
    title: "Handmade Lecture Notes",
    dateStr: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    paperStyle: "notebook",
    handwritingFont: "Caveat",
    inkColor: "#1a365d",
    fontSize: 22,
    lineHeight: 1.8,
    paperMargin: 40,
    jitterTilt: true,
    showCoffeeStain: true,
    showDoodles: false,
  });

  const paperRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState<boolean>(false);
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);

  // Paper styling helper
  const getPaperBgStyle = (style: PaperStyle): React.CSSProperties => {
    switch (style) {
      case "notebook":
        return {
          backgroundColor: "#fefefe",
          backgroundImage:
            "linear-gradient(#e2e8f0 1px, transparent 1px), linear-gradient(90deg, transparent 59px, #ef4444 60px, transparent 61px)",
          backgroundSize: "100% 32px, 100% 100%",
        };
      case "legal_pad":
        return {
          backgroundColor: "#fef08a",
          backgroundImage:
            "linear-gradient(#fde047 1px, transparent 1px), linear-gradient(90deg, transparent 59px, #ef4444 60px, transparent 61px)",
          backgroundSize: "100% 32px, 100% 100%",
        };
      case "graph_paper":
        return {
          backgroundColor: "#f8fafc",
          backgroundImage:
            "linear-gradient(to right, #e2e8f0 1px, transparent 1px), linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        };
      case "parchment":
        return {
          backgroundColor: "#fef3c7",
          backgroundImage:
            "radial-gradient(#d97706 0.75px, transparent 0.75px), radial-gradient(#d97706 0.75px, #fef3c7 0.75px)",
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0, 15px 15px",
          boxShadow: "inset 0 0 40px rgba(180, 83, 9, 0.15)",
        };
      case "sticky_note":
        return {
          backgroundColor: "#fef08a",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.3)",
        };
      case "kraft":
        return {
          backgroundColor: "#d97706",
          opacity: 0.9,
          backgroundImage:
            "radial-gradient(#92400e 0.5px, transparent 0.5px), radial-gradient(#92400e 0.5px, #b45309 0.5px)",
          backgroundSize: "20px 20px",
          color: "#27272a",
        };
      case "clean_paper":
      default:
        return {
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        };
    }
  };

  // Convert HTML paper element into high-resolution canvas for PNG/PDF download
  const drawPaperToCanvas = async (): Promise<HTMLCanvasElement | null> => {
    if (!paperRef.current) return null;
    const element = paperRef.current;

    // Create a canvas with high scale density
    const width = 800;
    const height = 1100; // Standard page ratio
    const canvas = document.createElement("canvas");
    canvas.width = width * 2; // 2x scale for crisp export
    canvas.height = height * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.scale(2, 2);

    // Draw background paper color & rules
    if (config.paperStyle === "notebook") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // Horizontal lines
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;
      for (let y = 80; y < height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Vertical red margin line
      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.lineTo(60, height);
      ctx.stroke();
    } else if (config.paperStyle === "legal_pad") {
      ctx.fillStyle = "#fef08a";
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 1;
      for (let y = 80; y < height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.strokeStyle = "#ef4444";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.lineTo(60, height);
      ctx.stroke();
    } else if (config.paperStyle === "parchment") {
      ctx.fillStyle = "#fef3c7";
      ctx.fillRect(0, 0, width, height);
    } else if (config.paperStyle === "graph_paper") {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 24) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 24) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
    } else {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    // Coffee stain drawing
    if (config.showCoffeeStain) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(width - 120, 140, 55, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(180, 83, 9, 0.25)";
      ctx.lineWidth = 8;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width - 110, 145, 50, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(180, 83, 9, 0.15)";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }

    // Draw Title & Date in top margin
    ctx.fillStyle = config.inkColor;
    ctx.font = `600 24px "${config.handwritingFont}", cursive, sans-serif`;
    ctx.fillText(config.title || "Handmade File", 70, 50);

    ctx.font = `400 18px "${config.handwritingFont}", cursive, sans-serif`;
    ctx.fillText(config.dateStr || "", width - 180, 50);

    // Draw Handwritten Text Lines
    const lines = text.split("\n");
    let currentY = 110;
    const startX = config.paperStyle === "notebook" || config.paperStyle === "legal_pad" ? 75 : 50;
    const maxLineWidth = width - startX - 50;

    ctx.font = `${config.fontSize}px "${config.handwritingFont}", cursive, sans-serif`;

    for (let i = 0; i < lines.length; i++) {
      const lineText = lines[i];

      // Simple word wrapping
      const words = lineText.split(" ");
      let currentLine = "";

      for (let w = 0; w < words.length; w++) {
        const testLine = currentLine + words[w] + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxLineWidth && w > 0) {
          // Draw current line
          ctx.save();
          if (config.jitterTilt) {
            const angle = (Math.random() - 0.5) * 0.012;
            ctx.rotate(angle);
          }
          ctx.fillText(currentLine, startX, currentY);
          ctx.restore();

          currentY += config.fontSize * config.lineHeight;
          currentLine = words[w] + " ";
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine.trim()) {
        ctx.save();
        if (config.jitterTilt) {
          const angle = (Math.random() - 0.5) * 0.012;
          ctx.rotate(angle);
        }
        ctx.fillText(currentLine, startX, currentY);
        ctx.restore();
        currentY += config.fontSize * config.lineHeight;
      } else {
        currentY += config.fontSize * config.lineHeight;
      }

      if (currentY > height - 60) break; // page limit
    }

    return canvas;
  };

  const handleExportPNG = async () => {
    setExporting(true);
    try {
      const canvas = await drawPaperToCanvas();
      if (!canvas) return;

      const imageURI = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${config.title.toLowerCase().replace(/\s+/g, "_")}_handmade.png`;
      link.href = imageURI;
      link.click();

      setExportSuccess("Exported PNG Image!");
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const canvas = await drawPaperToCanvas();
      if (!canvas) return;

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${config.title.toLowerCase().replace(/\s+/g, "_")}_handmade.pdf`);

      setExportSuccess("Exported PDF Document!");
      setTimeout(() => setExportSuccess(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadText = () => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${config.title.toLowerCase().replace(/\s+/g, "_")}.txt`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Feather className="w-5 h-5 text-cyan-400" />
              Handmade File Canvas & Handwriting Document Renderer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Transform humanized text into authentic handwritten notebook files, legal pads, parchment, or downloadable PDFs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportPNG}
              disabled={exporting}
              className="px-3.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              <FileImage className="w-4 h-4" />
              <span>Export PNG</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={exporting}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF File</span>
            </button>

            <button
              onClick={handleDownloadText}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Download .txt</span>
            </button>
          </div>
        </div>

        {exportSuccess && (
          <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{exportSuccess}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT PANEL: Customize Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>Handmade File Aesthetics</span>
          </h3>

          {/* Document Header Input */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">Document Title & Date</label>
            <input
              type="text"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              placeholder="Title"
            />
          </div>

          {/* Paper Style */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">Paper Texture & Type</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "notebook", label: "Lined Notebook" },
                { id: "legal_pad", label: "Yellow Legal Pad" },
                { id: "graph_paper", label: "Graph Grid" },
                { id: "parchment", label: "Aged Parchment" },
                { id: "sticky_note", label: "Sticky Note" },
                { id: "clean_paper", label: "Clean Linen" },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setConfig({ ...config, paperStyle: p.id as PaperStyle })}
                  className={`p-2 rounded-lg text-xs font-medium border text-left transition-all ${
                    config.paperStyle === p.id
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold"
                      : "bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Handwriting Font */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">Handwriting Font Style</label>
            <select
              value={config.handwritingFont}
              onChange={(e) => setConfig({ ...config, handwritingFont: e.target.value as HandwritingFont })}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans"
            >
              <option value="Caveat">Caveat (Casual Cursive Flow)</option>
              <option value="Indie Flower">Indie Flower (Natural Hand-Printed)</option>
              <option value="Patrick Hand">Patrick Hand (Neat Classroom Print)</option>
              <option value="Architects Daughter">Architects Daughter (Draft Print)</option>
              <option value="Nanum Pen Script">Nanum Pen Script (Expressive Marker)</option>
              <option value="Shadows Into Light">Shadows Into Light (Quick Scribble)</option>
            </select>
          </div>

          {/* Ink Color */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">Pen Ink Color</label>
            <div className="flex items-center gap-2">
              {[
                { hex: "#1a365d", name: "Navy Blue" },
                { hex: "#111827", name: "Jet Black" },
                { hex: "#1e40af", name: "Royal Blue" },
                { hex: "#991b1b", name: "Red Ink" },
                { hex: "#4b5563", name: "Graphite" },
              ].map((ink) => (
                <button
                  key={ink.hex}
                  onClick={() => setConfig({ ...config, inkColor: ink.hex as InkColor })}
                  style={{ backgroundColor: ink.hex }}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    config.inkColor === ink.hex ? "border-amber-400 scale-110 shadow-md" : "border-slate-700 opacity-80 hover:opacity-100"
                  }`}
                  title={ink.name}
                />
              ))}
            </div>
          </div>

          {/* Font Size & Spacing */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Handwriting Size</span>
                <span className="font-semibold text-amber-400">{config.fontSize}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="32"
                value={config.fontSize}
                onChange={(e) => setConfig({ ...config, fontSize: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Imperfection Toggles */}
            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.jitterTilt}
                  onChange={(e) => setConfig({ ...config, jitterTilt: e.target.checked })}
                  className="accent-amber-500 rounded"
                />
                <span>Natural Human Rotation Jitter (Subtle Line Slant)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showCoffeeStain}
                  onChange={(e) => setConfig({ ...config, showCoffeeStain: e.target.checked })}
                  className="accent-amber-500 rounded"
                />
                <span>Include Coffee Ring Stain Effect</span>
              </label>
            </div>
          </div>

          {/* Text Input area */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="block text-xs font-medium text-slate-300">Edit Note Content</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-36 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 resize-none font-sans"
            ></textarea>
          </div>
        </div>

        {/* RIGHT PANEL: Live Paper Preview */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col items-center">
            <div className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Live Rendered Handwritten Page</span>
            </div>

            {/* Rendered Paper Box */}
            <div
              ref={paperRef}
              style={{
                ...getPaperBgStyle(config.paperStyle),
                fontFamily: `"${config.handwritingFont}", cursive, sans-serif`,
                color: config.inkColor,
                fontSize: `${config.fontSize}px`,
                lineHeight: config.lineHeight,
              }}
              className="w-full min-h-[550px] p-8 sm:p-12 rounded-lg shadow-xl relative overflow-hidden transition-all duration-300 border border-slate-300/40"
            >
              {/* Coffee Stain Ring Visual Overlay */}
              {config.showCoffeeStain && (
                <div
                  className="absolute top-6 right-8 w-28 h-28 rounded-full border-8 border-amber-900/10 pointer-events-none"
                  style={{
                    boxShadow: "inset 0 0 15px rgba(180, 83, 9, 0.1)",
                    transform: "rotate(12deg)",
                  }}
                ></div>
              )}

              {/* Title Header */}
              <div className="flex justify-between items-baseline mb-6 border-b border-slate-400/30 pb-2">
                <span className="font-bold text-2xl tracking-wide">{config.title}</span>
                <span className="text-base opacity-80">{config.dateStr}</span>
              </div>

              {/* Body Handwriting */}
              <div className="whitespace-pre-wrap font-normal leading-relaxed text-slate-900 selection:bg-amber-200">
                {text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
