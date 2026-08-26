export type ToneType = 
  | "conversational"
  | "academic_human"
  | "storyteller"
  | "thoughtful_blog"
  | "email_work"
  | "raw_casual";

export type AntiDetectionLevel = "balanced" | "high" | "maximum";

export type ReadingLevel = "natural" | "high_school" | "college" | "simplified";

export interface HumanizeOptions {
  tone: ToneType;
  antiDetectionLevel: AntiDetectionLevel;
  readingLevel: ReadingLevel;
  userNotes: string;
}

export interface HumanizeResponse {
  humanizedText: string;
  changesSummary: string[];
  estimatedHumanScoreBefore: number;
  estimatedHumanScoreAfter: number;
  burstinessRating: string;
  removedAiMarkers: string[];
}

export interface FlaggedWord {
  word: string;
  reason: string;
  suggestion: string;
}

export interface SentenceAnalysis {
  text: string;
  aiRisk: "low" | "medium" | "high";
  feedback: string;
}

export interface AnalysisResponse {
  aiProbability: number;
  humanProbability: number;
  burstinessScore: number;
  perplexityScore: number;
  overallVerdict: string;
  flaggedWords: FlaggedWord[];
  sentenceAnalysis: SentenceAnalysis[];
}

export type PaperStyle =
  | "notebook"
  | "legal_pad"
  | "graph_paper"
  | "parchment"
  | "sticky_note"
  | "clean_paper"
  | "kraft";

export type HandwritingFont =
  | "Caveat"
  | "Indie Flower"
  | "Patrick Hand"
  | "Architects Daughter"
  | "Nanum Pen Script"
  | "Shadows Into Light";

export type InkColor =
  | "#1a365d" // Navy Blue
  | "#111827" // Jet Black
  | "#1e40af" // Royal Blue
  | "#991b1b" // Red Ink
  | "#4b5563"; // Graphite Grey

export interface HandMadeFileConfig {
  title: string;
  dateStr: string;
  paperStyle: PaperStyle;
  handwritingFont: HandwritingFont;
  inkColor: InkColor;
  fontSize: number; // in px
  lineHeight: number; // multiplier
  paperMargin: number; // in px
  jitterTilt: boolean; // subtle random letter rotation
  showCoffeeStain: boolean;
  showDoodles: boolean;
}

export interface SavedDocument {
  id: string;
  title: string;
  originalText: string;
  humanizedText: string;
  createdAt: string;
  humanScore: number;
  config: HandMadeFileConfig;
}
