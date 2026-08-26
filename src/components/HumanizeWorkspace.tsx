import React, { useState } from "react";
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  FileText,
  Sliders,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Volume2,
  Wand2,
  Send,
  HelpCircle,
  Feather
} from "lucide-react";
import { ToneType, AntiDetectionLevel, ReadingLevel, HumanizeResponse } from "../types";
import { SAMPLES } from "../data/samples";

interface HumanizeWorkspaceProps {
  inputText: string;
  setInputText: (text: string) => void;
  outputResult: HumanizeResponse | null;
  setOutputResult: (res: HumanizeResponse | null) => void;
  onSendToHandmade: (text: string) => void;
  onSaveDocument: (title: string, orig: string, hum: string, score: number) => void;
}

export const HumanizeWorkspace: React.FC<HumanizeWorkspaceProps> = ({
  inputText,
  setInputText,
  outputResult,
  setOutputResult,
  onSendToHandmade,
  onSaveDocument,
}) => {
  const [tone, setTone] = useState<ToneType>("conversational");
  const [antiDetectionLevel, setAntiDetectionLevel] = useState<AntiDetectionLevel>("balanced");
  const [readingLevel, setReadingLevel] = useState<ReadingLevel>("natural");
  const [userNotes, setUserNotes] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [showDiff, setShowDiff] = useState<boolean>(false);
  const [docTitle, setDocTitle] = useState<string>("My Humanized Document");
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      setErrorMsg("Please enter or paste some AI text to humanize.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          tone,
          antiDetectionLevel,
          readingLevel,
          userNotes,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || "Failed to humanize text.");
      }

      const data: HumanizeResponse = await response.json();
      setOutputResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred while humanizing.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputResult?.humanizedText) return;
    navigator.clipboard.writeText(outputResult.humanizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    if (!outputResult?.humanizedText) return;
    onSaveDocument(
      docTitle || "Humanized Note",
      inputText,
      outputResult.humanizedText,
      outputResult.estimatedHumanScoreAfter
    );
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const selectSample = (text: string) => {
    setInputText(text);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-6">
      {/* Sample Quick Loader */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-slate-200">
              Try a Sample AI Text or Paste Below:
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Click any prompt to load instant AI text with buzzwords
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SAMPLES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => selectSample(sample.text)}
              className="text-left p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/40 transition-all text-xs group"
            >
              <div className="font-medium text-slate-200 group-hover:text-amber-300 truncate">
                {sample.title}
              </div>
              <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                {sample.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Control Panel: Tone, Bypass Strength, Reading Level */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              Humanization Style & Anti-AI Detector Parameters
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Tone Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Writing Tone & Voice
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: "conversational", label: "Conversational", icon: "💬" },
                { id: "thoughtful_blog", label: "Thoughtful Blog", icon: "✍️" },
                { id: "storyteller", label: "Storyteller", icon: "📖" },
                { id: "email_work", label: "Work Email", icon: "✉️" },
                { id: "academic_human", label: "Academic Human", icon: "🎓" },
                { id: "raw_casual", label: "Raw Casual", icon: "📝" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id as ToneType)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    tone === t.id
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold"
                      : "bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:bg-slate-800"
                  }`}
                >
                  <span>{t.icon}</span>
                  <span className="truncate">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Anti-Detection Strength */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Bypass AI Detector Intensity
            </label>
            <div className="space-y-2">
              {[
                {
                  id: "balanced",
                  label: "Balanced Naturalness",
                  desc: "Keeps tone smooth while replacing AI markers",
                },
                {
                  id: "high",
                  label: "High Human Rhythm",
                  desc: "Shuffles sentence lengths & introduces idioms",
                },
                {
                  id: "maximum",
                  label: "Maximum Anti-Detection",
                  desc: "Aggressive rephrasing for 99%+ human pass rate",
                },
              ].map((level) => (
                <label
                  key={level.id}
                  className={`flex items-start gap-2.5 p-2 rounded-xl border cursor-pointer transition-all ${
                    antiDetectionLevel === level.id
                      ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                      : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800/80"
                  }`}
                >
                  <input
                    type="radio"
                    name="antiDetect"
                    checked={antiDetectionLevel === level.id}
                    onChange={() => setAntiDetectionLevel(level.id as AntiDetectionLevel)}
                    className="mt-1 accent-emerald-500"
                  />
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{level.label}</div>
                    <div className="text-[10px] text-slate-400">{level.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Custom Voice Notes & Reading Level */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Reading Level
              </label>
              <select
                value={readingLevel}
                onChange={(e) => setReadingLevel(e.target.value as ReadingLevel)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="natural">Natural / Universal (Recommended)</option>
                <option value="high_school">Clear High School</option>
                <option value="college">Rigorous College / Professional</option>
                <option value="simplified">Simplified & Direct</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Custom Voice / Special Instructions (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 'Use simple words', 'Add light humor', 'Sound like an engineer'"
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Workspace: Input vs Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT PANE: AI Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <h3 className="text-sm font-semibold text-slate-200">AI / Robotic Text Input</h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{inputText.length} chars</span>
              <span>•</span>
              <span>{inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words</span>
              {inputText.trim() && (
                <button
                  onClick={() => setInputText("")}
                  className="ml-2 text-rose-400 hover:text-rose-300 hover:underline"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste your AI-generated draft here (e.g. text from ChatGPT, Claude, Gemini, or school/work draft)..."
            className="w-full h-72 bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/80 resize-none font-sans leading-relaxed"
          ></textarea>

          <button
            id="btn-humanize-now"
            onClick={handleHumanize}
            disabled={isLoading || !inputText.trim()}
            className="w-full py-3.5 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 text-slate-950 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Wand2 className="w-5 h-5 animate-spin" />
                <span>Removing AI Patterns & Humanizing Phrasing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Humanize & Bypass AI Detection</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* RIGHT PANE: Humanized Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col space-y-3 shadow-xl relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-200">Authentic Human Output</h3>
            </div>
            {outputResult && (
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {outputResult.estimatedHumanScoreAfter}% Human Pass
                </span>
              </div>
            )}
          </div>

          <div className="relative min-h-[18rem] flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4">
            {isLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-950/90 rounded-xl backdrop-blur-sm">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 border-t-amber-400 animate-spin"></div>
                  <Feather className="w-6 h-6 text-amber-400 absolute inset-0 m-auto" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200">Humanizing Your Text</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Varying sentence length • Eliminating "delve", "tapestry", "moreover" • Injecting natural cadence
                  </p>
                </div>
              </div>
            ) : outputResult ? (
              <div className="space-y-4">
                {/* Score Bar */}
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Before:</span>
                    <span className="font-semibold text-rose-400">
                      {outputResult.estimatedHumanScoreBefore}% Human
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-400">After:</span>
                    <span className="font-bold text-emerald-400">
                      {outputResult.estimatedHumanScoreAfter}% Human
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>Burstiness:</span>
                    <span className="font-medium text-amber-300">
                      {outputResult.burstinessRating}
                    </span>
                  </div>
                </div>

                {/* Main Text Content */}
                <div className="text-sm text-slate-100 font-sans leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto pr-2">
                  {outputResult.humanizedText}
                </div>

                {/* Removed AI Markers Badges */}
                {outputResult.removedAiMarkers && outputResult.removedAiMarkers.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <div className="text-[11px] font-medium text-slate-400 mb-1.5">
                      Eliminated AI Buzzwords & Patterns:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {outputResult.removedAiMarkers.map((marker, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-300 border border-rose-500/20 line-through"
                        >
                          {marker}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                <Feather className="w-8 h-8 text-slate-700" />
                <p className="text-xs">
                  Click <strong className="text-amber-400 font-medium">Humanize & Bypass AI Detection</strong> to generate authentic human writing here.
                </p>
              </div>
            )}
          </div>

          {/* Action Toolbar */}
          {outputResult && (
            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{copied ? "Copied!" : "Copy Text"}</span>
                </button>

                <button
                  onClick={() => onSendToHandmade(outputResult.humanizedText)}
                  className="px-3 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Convert to Handmade Note</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{savedSuccess ? "Saved!" : "Save File"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
