import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, Upload, Image, Film, FileText, Scan, Shield, AlertTriangle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GUEST_HISTORY_KEY = "truthlens-guest-history";

type InputMode = "link" | "image" | "video" | "text";
type ScanStatus = "idle" | "scanning" | "done";

interface HFClassification {
  labels: { label: string; score: number }[];
  top_label: string;
  confidence: number;
}

interface ScanResult {
  credibility_score: number;
  verdict: string;
  summary: string;
  red_flags: { flag: string; severity: string; explanation: string }[];
  ai_generated_probability: number;
  recommendations: string[];
  hf_classification?: HFClassification | null;
}

interface GuestScanEntry {
  id: string;
  content: string;
  content_type: string;
  credibility_score: number;
  result: ScanResult;
  created_at: string;
}

const inputModes: { key: InputMode; icon: typeof Link; label: string }[] = [
  { key: "link", icon: Link, label: "Paste Link" },
  { key: "image", icon: Image, label: "Upload Image" },
  { key: "video", icon: Film, label: "Upload Video" },
  { key: "text", icon: FileText, label: "Paste Text" },
];

function getScoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  return "text-red-400";
}

function getScoreGlow(score: number) {
  if (score >= 70) return "shadow-[0_0_30px_hsl(142_70%_50%/0.3)]";
  if (score >= 40) return "shadow-[0_0_30px_hsl(45_90%_55%/0.3)]";
  return "shadow-[0_0_30px_hsl(0_80%_55%/0.3)]";
}

function getScoreIcon(score: number) {
  if (score >= 70) return Shield;
  if (score >= 40) return AlertTriangle;
  return XCircle;
}

function getScoreBg(score: number) {
  if (score >= 70) return "from-green-500/20 to-green-500/5";
  if (score >= 40) return "from-yellow-500/20 to-yellow-500/5";
  return "from-red-500/20 to-red-500/5";
}

function getVerdictLabel(verdict: string) {
  const map: Record<string, string> = {
    credible: "Credible",
    mostly_credible: "Mostly Credible",
    mixed: "Mixed Credibility",
    mostly_false: "Mostly False",
    false: "False",
    satire: "Satire",
    opinion: "Opinion",
  };
  return map[verdict] || verdict;
}

function getSeverityColor(severity: string) {
  if (severity === "high") return "text-red-400";
  if (severity === "medium") return "text-yellow-400";
  return "text-muted-foreground";
}

export default function DetectorSection() {
  const [mode, setMode] = useState<InputMode>("link");
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [result, setResult] = useState<ScanResult | null>(null);

  const saveGuestHistory = useCallback((scanResult: ScanResult, content: string, contentType: string) => {
    const existingHistory = window.localStorage.getItem(GUEST_HISTORY_KEY);
    const history: GuestScanEntry[] = existingHistory ? JSON.parse(existingHistory) as GuestScanEntry[] : [];

    const nextEntry: GuestScanEntry = {
      id: crypto.randomUUID(),
      content,
      content_type: contentType,
      credibility_score: scanResult.credibility_score,
      result: scanResult,
      created_at: new Date().toISOString(),
    };

    window.localStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify([nextEntry, ...history].slice(0, 20)));
  }, []);

  const handleScan = useCallback(async () => {
    if (!inputValue.trim()) return;

    setStatus("scanning");
    setResult(null);

    try {
      const contentType = mode === "link" ? "url" : mode;
      const { data, error } = await supabase.functions.invoke("analyze-content", {
        body: { content: inputValue.trim(), content_type: contentType },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data);
      saveGuestHistory(data as ScanResult, inputValue.trim(), contentType);
      setStatus("done");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Analysis failed. Please try again.";
      toast.error(message);
      setStatus("idle");
    }
  }, [inputValue, mode, saveGuestHistory]);

  const handleFileSelect = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = mode === "image" ? "image/*" : "video/*";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setInputValue(reader.result);
        }
      };
      reader.readAsDataURL(file);
    };

    input.click();
  };

  const handleReset = () => {
    setStatus("idle");
    setResult(null);
    setInputValue("");
  };

  return (
    <section id="detector" className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">AI Content Scanner</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Paste a link, upload media, or enter text to scan for manipulation and misinformation.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 relative overflow-hidden"
        >
          {/* Scanning overlay */}
          <AnimatePresence>
            {status === "scanning" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm"
              >
                <div className="relative w-40 h-40">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute inset-0 rounded-full border-2 border-neon-cyan/50 border-t-neon-cyan" />
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute inset-4 rounded-full border-2 border-neon-purple/50 border-t-neon-purple" />
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }} className="absolute inset-8 rounded-full border-2 border-neon-blue/50 border-t-neon-blue" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Scan className="w-8 h-8 text-neon-cyan animate-glow-pulse" />
                  </div>
                </div>
                <p className="mt-6 font-mono text-sm text-neon-cyan tracking-wider">AI ANALYZING CONTENT...</p>
                <div className="mt-3 flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div key={i} animate={{ scaleY: [1, 2, 1] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} className="w-1 h-4 bg-neon-cyan/60 rounded-full" />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input mode tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {inputModes.map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => { setMode(key); handleReset(); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 ${
                  mode === key
                    ? "bg-neon-cyan/10 border border-neon-cyan/40 text-neon-cyan shadow-glow-cyan"
                    : "bg-muted/30 border border-border text-muted-foreground hover:border-muted-foreground/40"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Input area */}
          {mode === "text" ? (
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Paste the text you want to analyze..."
              className="w-full h-32 bg-muted/30 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/40 focus:shadow-glow-cyan transition-all duration-300 resize-none font-mono text-sm"
            />
          ) : mode === "image" || mode === "video" ? (
            <div
              className="w-full h-32 bg-muted/30 border-2 border-dashed border-border rounded-xl flex items-center justify-center cursor-pointer hover:border-neon-cyan/40 transition-all duration-300"
              onClick={handleFileSelect}
            >
              <div className="text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Click to upload {mode === "image" ? "an image" : "a video"}</p>
                {inputValue && <p className="text-xs text-neon-cyan mt-1 font-mono">Media ready for analysis</p>}
              </div>
            </div>
          ) : (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Paste a news article URL..."
              className="w-full bg-muted/30 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/40 focus:shadow-glow-cyan transition-all duration-300 font-mono text-sm"
            />
          )}

          {/* Scan button */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleScan}
              disabled={!inputValue.trim() || status === "scanning"}
              className="flex-1 group relative px-6 py-3 rounded-xl font-display text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan opacity-90 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center justify-center gap-2 text-primary-foreground">
                <Scan className="w-4 h-4" />
                {status === "scanning" ? "Analyzing..." : "Scan Now"}
              </span>
            </button>
            {status === "done" && (
              <button onClick={handleReset} className="px-6 py-3 rounded-xl font-display text-sm tracking-wider uppercase border border-border text-muted-foreground hover:border-neon-cyan/40 transition-all duration-300">
                Reset
              </button>
            )}
          </div>

          {/* Results */}
          <AnimatePresence>
            {status === "done" && result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-8">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />

                <div className="flex flex-col md:flex-row items-start gap-8">
                  {/* Score circle */}
                  <div className={`relative w-36 h-36 rounded-full flex items-center justify-center bg-gradient-to-br ${getScoreBg(result.credibility_score)} ${getScoreGlow(result.credibility_score)} flex-shrink-0 mx-auto md:mx-0`}>
                    <div className="text-center">
                      <div className={`text-4xl font-display font-bold ${getScoreColor(result.credibility_score)}`}>
                        {result.credibility_score}
                      </div>
                      <div className="text-xs font-mono text-muted-foreground mt-1">TRUTH SCORE</div>
                    </div>
                    {(() => {
                      const Icon = getScoreIcon(result.credibility_score);
                      return <Icon className={`absolute -top-2 -right-2 w-8 h-8 ${getScoreColor(result.credibility_score)}`} />;
                    })()}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className={`text-2xl font-display font-bold ${getScoreColor(result.credibility_score)}`}>
                        {getVerdictLabel(result.verdict)}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{result.summary}</p>
                    </div>

                    {/* HF RoBERTa Classification */}
                    {result.hf_classification && (
                      <div className="p-3 rounded-lg bg-muted/30 border border-border space-y-2">
                        <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">RoBERTa ML Classification</h4>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-display font-bold ${
                            result.hf_classification.top_label.toLowerCase().includes("fake") || result.hf_classification.top_label.toLowerCase().includes("false")
                              ? "text-red-400" : "text-green-400"
                          }`}>
                            {result.hf_classification.top_label}
                          </span>
                          <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                            <motion.div
                              animate={{ scaleX: result.hf_classification.confidence / 100 }}
                              transition={{ duration: 0.7 }}
                              className={`h-full w-full origin-left rounded-full ${
                                result.hf_classification.top_label.toLowerCase().includes("fake") || result.hf_classification.top_label.toLowerCase().includes("false")
                                  ? "bg-gradient-to-r from-red-500 to-red-400" : "bg-gradient-to-r from-green-500 to-green-400"
                              }`}
                            />
                          </div>
                          <span className="font-mono text-sm text-foreground">{result.hf_classification.confidence}%</span>
                        </div>
                      </div>
                    )}

                    {/* AI generated probability */}
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-mono text-muted-foreground">AI Generated:</span>
                      <div className="flex-1 h-2 bg-muted/50 rounded-full overflow-hidden">
                        <motion.div
                          animate={{ scaleX: result.ai_generated_probability / 100 }}
                          transition={{ duration: 0.7 }}
                          className="h-full w-full origin-left rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan"
                        />
                      </div>
                      <span className="font-mono text-foreground">{result.ai_generated_probability}%</span>
                    </div>

                    {/* Red flags */}
                    {result.red_flags.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Red Flags</h4>
                        {result.red_flags.map((flag, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="flex items-start gap-3 text-sm"
                          >
                            <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${getSeverityColor(flag.severity)}`} />
                            <div>
                              <span className={`font-medium ${getSeverityColor(flag.severity)}`}>{flag.flag}</span>
                              <p className="text-muted-foreground text-xs mt-0.5">{flag.explanation}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Recommendations */}
                    {result.recommendations.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Recommendations</h4>
                        {result.recommendations.map((rec, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className="flex items-start gap-3 text-sm"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-1.5 shrink-0" />
                            <span className="text-muted-foreground">{rec}</span>
                          </motion.div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
