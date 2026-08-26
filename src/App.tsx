import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { HumanizeWorkspace } from "./components/HumanizeWorkspace";
import { AiInspector } from "./components/AiInspector";
import { HandmadeCanvas } from "./components/HandmadeCanvas";
import { SavedFiles } from "./components/SavedFiles";
import { HumanizeResponse, SavedDocument } from "./types";
import { Sparkles, Feather, FileText, CheckCircle2 } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"humanize" | "inspector" | "handmade" | "saved">("humanize");
  const [inputText, setInputText] = useState<string>("");
  const [outputResult, setOutputResult] = useState<HumanizeResponse | null>(null);
  const [handmadeText, setHandmadeText] = useState<string>("");
  const [savedDocs, setSavedDocs] = useState<SavedDocument[]>([]);

  // Load saved documents from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("humanizer_saved_docs");
      if (stored) {
        setSavedDocs(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved docs from localStorage", e);
    }
  }, []);

  // Save documents to localStorage when modified
  const saveToLocalStorage = (docs: SavedDocument[]) => {
    setSavedDocs(docs);
    try {
      localStorage.setItem("humanizer_saved_docs", JSON.stringify(docs));
    } catch (e) {
      console.error("Failed to save docs to localStorage", e);
    }
  };

  const handleSaveDocument = (
    title: string,
    orig: string,
    hum: string,
    score: number
  ) => {
    const newDoc: SavedDocument = {
      id: "doc_" + Date.now(),
      title,
      originalText: orig,
      humanizedText: hum,
      createdAt: new Date().toISOString(),
      humanScore: score,
      config: {
        title,
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
      },
    };

    const updated = [newDoc, ...savedDocs];
    saveToLocalStorage(updated);
  };

  const handleDeleteDocument = (id: string) => {
    const updated = savedDocs.filter((d) => d.id !== id);
    saveToLocalStorage(updated);
  };

  const handleSendToHandmade = (text: string) => {
    setHandmadeText(text);
    setActiveTab("handmade");
  };

  const handleInspectText = (text: string) => {
    setInputText(text);
    setActiveTab("humanize");
  };

  const handleRestoreToWorkspace = (doc: SavedDocument) => {
    setInputText(doc.originalText || doc.humanizedText);
    setOutputResult({
      humanizedText: doc.humanizedText,
      changesSummary: ["Restored from saved archive"],
      estimatedHumanScoreBefore: 30,
      estimatedHumanScoreAfter: doc.humanScore,
      burstinessRating: "Dynamic",
      removedAiMarkers: ["AI Buzzwords Removed"],
    });
    setActiveTab("humanize");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col antialiased">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} savedCount={savedDocs.length} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "humanize" && (
          <HumanizeWorkspace
            inputText={inputText}
            setInputText={setInputText}
            outputResult={outputResult}
            setOutputResult={setOutputResult}
            onSendToHandmade={handleSendToHandmade}
            onSaveDocument={handleSaveDocument}
          />
        )}

        {activeTab === "inspector" && (
          <AiInspector
            inputText={inputText}
            setInputText={setInputText}
            onHumanizeRequest={handleInspectText}
          />
        )}

        {activeTab === "handmade" && <HandmadeCanvas initialText={handmadeText || outputResult?.humanizedText || inputText} />}

        {activeTab === "saved" && (
          <SavedFiles
            documents={savedDocs}
            onDeleteDocument={handleDeleteDocument}
            onRestoreToWorkspace={handleRestoreToWorkspace}
            onSendToHandmade={handleSendToHandmade}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Feather className="w-4 h-4 text-amber-400" />
            <span className="font-semibold text-slate-400">Humanizer Studio</span>
            <span>•</span>
            <span>AI Text Humanizer & Handmade Document Studio</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Server-side Gemini 3.7 Flash</span>
            <span>•</span>
            <span>PDF / PNG Canvas Exports</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
