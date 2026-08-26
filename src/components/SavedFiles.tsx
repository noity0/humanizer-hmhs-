import React from "react";
import { BookmarkCheck, Trash2, FileText, ArrowRight, Copy, Check, Calendar } from "lucide-react";
import { SavedDocument } from "../types";

interface SavedFilesProps {
  documents: SavedDocument[];
  onDeleteDocument: (id: string) => void;
  onRestoreToWorkspace: (doc: SavedDocument) => void;
  onSendToHandmade: (text: string) => void;
}

export const SavedFiles: React.FC<SavedFilesProps> = ({
  documents,
  onDeleteDocument,
  onRestoreToWorkspace,
  onSendToHandmade,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (doc: SavedDocument) => {
    navigator.clipboard.writeText(doc.humanizedText);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-indigo-400" />
            <span>Saved Humanized Files & Manuscripts</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access your previously humanized texts, restore them to workspace, or convert to handwritten note exports.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
          {documents.length} Saved Files
        </span>
      </div>

      {documents.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 space-y-3">
          <FileText className="w-10 h-10 text-slate-700 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No Saved Files Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you humanize text in the workspace, click "Save File" to keep a local archive of your humanized documents here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-slate-200 line-clamp-1">{doc.title}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold shrink-0">
                    {doc.humanScore}% Human
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(doc.createdAt).toLocaleString()}</span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-4 bg-slate-950 p-3 rounded-xl border border-slate-800 font-sans leading-relaxed">
                  {doc.humanizedText}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(doc)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-all"
                    title="Copy Text"
                  >
                    {copiedId === doc.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </button>

                  <button
                    onClick={() => onSendToHandmade(doc.humanizedText)}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-medium flex items-center gap-1 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Canvas</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRestoreToWorkspace(doc)}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1 transition-all"
                  >
                    <span>Edit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
