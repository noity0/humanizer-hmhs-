import React, { useState } from "react";
import { Search, AlertTriangle, ShieldCheck, CheckCircle2, RefreshCw, BarChart2, Info, ArrowRight } from "lucide-react";
import { AnalysisResponse, FlaggedWord, SentenceAnalysis } from "../types";

interface AiInspectorProps {
  inputText: string;
  setInputText: (text: string) => void;
  onHumanizeRequest: (text: string) => void;
}

export const AiInspector: React.FC<AiInspectorProps> = ({ inputText, setInputText, onHumanizeRequest }) => {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      setErrorMsg("Please enter or paste text to analyze.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || errData.details || "Failed to analyze text.");
      }

      const data: AnalysisResponse = await response.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplaceWord = (word: string, replacement: string) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    const updated = inputText.replace(regex, replacement);
    setInputText(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              AI Pattern Inspector & Perplexity Analyzer
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Inspect text for telltale AI markers, robotic buzzwords, and sentence monotony before publishing.
            </p>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isLoading || !inputText.trim()}
            className="py-2.5 px-5 rounded-xl font-semibold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-50 transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Scanning Patterns...</span>
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Scan for AI Markers</span>
              </>
            )}
          </button>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste text here to inspect for AI detection risk..."
          className="w-full h-36 bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80 resize-none font-sans"
        ></textarea>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Analysis Output Section */}
      {analysis && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="text-xs text-slate-400 font-medium">AI Generation Likelihood</div>
              <div className="text-2xl font-bold text-rose-400 my-2">
                {analysis.aiProbability}%
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full transition-all duration-500"
                  style={{ width: `${analysis.aiProbability}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="text-xs text-slate-400 font-medium">Human Authenticity Score</div>
              <div className="text-2xl font-bold text-emerald-400 my-2">
                {analysis.humanProbability}%
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${analysis.humanProbability}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="text-xs text-slate-400 font-medium">Burstiness (Sentence Variety)</div>
              <div className="text-2xl font-bold text-amber-400 my-2">
                {analysis.burstinessScore}/100
              </div>
              <p className="text-[10px] text-slate-400">Higher = more natural human rhythm</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div className="text-xs text-slate-400 font-medium">Perplexity (Vocabulary Flow)</div>
              <div className="text-2xl font-bold text-indigo-400 my-2">
                {analysis.perplexityScore}/100
              </div>
              <p className="text-[10px] text-slate-400">Higher = less predictable phrasing</p>
            </div>
          </div>

          {/* Verdict Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-semibold text-slate-200">Verdict & Feedback</div>
                <div className="text-xs text-slate-300 mt-0.5">{analysis.overallVerdict}</div>
              </div>
            </div>

            <button
              onClick={() => onHumanizeRequest(inputText)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <span>Humanize This Text</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Flagged AI Words */}
          {analysis.flaggedWords && analysis.flaggedWords.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Flagged AI Buzzwords & 1-Click Replacements</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {analysis.flaggedWords.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-rose-400 line-through">{item.word}</span>
                        <ArrowRight className="w-3 h-3 text-slate-500" />
                        <span className="font-bold text-emerald-400">{item.suggestion}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">{item.reason}</div>
                    </div>

                    <button
                      onClick={() => handleReplaceWord(item.word, item.suggestion)}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition-all shrink-0"
                    >
                      Swap Word
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sentence Heatmap Breakdown */}
          {analysis.sentenceAnalysis && analysis.sentenceAnalysis.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-cyan-400" />
                <span>Sentence Risk Breakdown Heatmap</span>
              </h3>
              <div className="space-y-2">
                {analysis.sentenceAnalysis.map((st, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-xs leading-relaxed transition-all ${
                      st.aiRisk === "high"
                        ? "bg-rose-500/10 border-rose-500/30 text-rose-200"
                        : st.aiRisk === "medium"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold uppercase text-[10px] tracking-wider">
                        Risk: {st.aiRisk}
                      </span>
                      <span className="text-[10px] opacity-80">{st.feedback}</span>
                    </div>
                    <p className="font-sans">{st.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
