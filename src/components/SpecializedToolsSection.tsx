import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserCircle, Scan, Shield, AlertTriangle, XCircle, Upload, Globe, Search } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

type ToolMode = "deepfake" | "credibility";
type ScanStatus = "idle" | "scanning" | "done";

interface DeepfakeResult {
  score: number;
  label: string;
  artifacts: { name: string; severity: "high" | "medium" | "low"; detail: string }[];
}

interface CredibilityResult {
  score: number;
  label: string;
  factors: { name: string; value: string; status: "good" | "warning" | "bad" }[];
}

function getScoreColor(score: number) {
  if (score >= 70) return "text-green-400";
  if (score >= 40) return "text-yellow-400";
  return "text-destructive";
}

function getScoreGlow(score: number) {
  if (score >= 70) return "shadow-[0_0_30px_hsl(142_70%_50%/0.3)]";
  if (score >= 40) return "shadow-[0_0_30px_hsl(45_90%_55%/0.3)]";
  return "shadow-[0_0_30px_hsl(0_80%_55%/0.3)]";
}

function getScoreBg(score: number) {
  if (score >= 70) return "from-green-500/20 to-green-500/5";
  if (score >= 40) return "from-yellow-500/20 to-yellow-500/5";
  return "from-red-500/20 to-red-500/5";
}

function generateDeepfakeResult(): DeepfakeResult {
  const score = Math.floor(Math.random() * 100);
  const label = score >= 70 ? "Likely Authentic" : score >= 40 ? "Possibly AI-Generated" : "Deepfake Detected";
  const artifacts = [
    { name: "Facial Boundary Analysis", severity: (score < 40 ? "high" : score < 70 ? "medium" : "low") as "high" | "medium" | "low", detail: score < 40 ? "Inconsistent blending at jawline and hairline" : score < 70 ? "Minor artifacts near ear regions" : "No boundary artifacts found" },
    { name: "Eye Reflection Consistency", severity: (score < 50 ? "high" : "low") as "high" | "low", detail: score < 50 ? "Asymmetric light reflections in pupils" : "Consistent corneal reflections" },
    { name: "Skin Texture Analysis", severity: (score < 60 ? "medium" : "low") as "medium" | "low", detail: score < 60 ? "Smoothing artifacts detected in pore structure" : "Natural skin texture patterns" },
    { name: "Temporal Coherence", severity: (score < 45 ? "high" : "low") as "high" | "low", detail: score < 45 ? "Frame-to-frame facial jitter detected" : "Stable temporal consistency" },
    { name: "GAN Fingerprint Scan", severity: (score < 55 ? "high" : "low") as "high" | "low", detail: score < 55 ? "GAN-specific frequency patterns identified" : "No GAN signatures found" },
  ];
  return { score, label, artifacts };
}

function generateCredibilityResult(): CredibilityResult {
  const score = Math.floor(Math.random() * 100);
  const label = score >= 70 ? "Credible Source" : score >= 40 ? "Mixed Reliability" : "Low Credibility";
  const factors = [
    { name: "Domain Age", value: score >= 60 ? "12+ years" : "< 6 months", status: (score >= 60 ? "good" : "bad") as "good" | "bad" },
    { name: "Fact-Check Record", value: score >= 50 ? `${Math.floor(score * 0.8)}% accuracy` : `${Math.floor(score * 0.5)}% accuracy`, status: (score >= 70 ? "good" : score >= 40 ? "warning" : "bad") as "good" | "warning" | "bad" },
    { name: "WHOIS Transparency", value: score >= 50 ? "Organization verified" : "Privacy-masked registration", status: (score >= 50 ? "good" : "warning") as "good" | "warning" },
    { name: "Content Bias Index", value: score >= 60 ? "Minimal bias detected" : "Significant partisan lean", status: (score >= 60 ? "good" : "bad") as "good" | "bad" },
    { name: "Citation Quality", value: score >= 55 ? "Links to primary sources" : "Rarely cites sources", status: (score >= 55 ? "good" : "bad") as "good" | "bad" },
    { name: "Social Trust Score", value: `${score}/100`, status: (score >= 70 ? "good" : score >= 40 ? "warning" : "bad") as "good" | "warning" | "bad" },
  ];
  return { score, label, factors };
}

const severityColors = {
  high: "text-destructive bg-destructive/10 border-destructive/30",
  medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  low: "text-green-400 bg-green-400/10 border-green-400/30",
};

const statusColors = {
  good: "text-green-400",
  warning: "text-yellow-400",
  bad: "text-destructive",
};

const statusDots = {
  good: "bg-green-400",
  warning: "bg-yellow-400",
  bad: "bg-destructive",
};

export default function SpecializedToolsSection() {
  const [tool, setTool] = useState<ToolMode>("deepfake");
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [inputValue, setInputValue] = useState("");
  const [deepfakeResult, setDeepfakeResult] = useState<DeepfakeResult | null>(null);
  const [credibilityResult, setCredibilityResult] = useState<CredibilityResult | null>(null);

  const handleScan = useCallback(() => {
    if (!inputValue.trim()) return;
    setStatus("scanning");
    setDeepfakeResult(null);
    setCredibilityResult(null);
    setTimeout(() => {
      if (tool === "deepfake") {
        setDeepfakeResult(generateDeepfakeResult());
      } else {
        setCredibilityResult(generateCredibilityResult());
      }
      setStatus("done");
    }, 2500);
  }, [inputValue, tool]);

  const handleReset = () => {
    setStatus("idle");
    setDeepfakeResult(null);
    setCredibilityResult(null);
    setInputValue("");
  };

  const switchTool = (t: ToolMode) => {
    setTool(t);
    handleReset();
  };

  return (
    <section id="tools" className="relative py-32 px-4">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Specialized AI Tools</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Advanced deepfake detection and source credibility analysis powered by AI forensics.
          </p>
        </motion.div>

        {/* Tool selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => switchTool("deepfake")}
            className={`glass-card p-6 text-left transition-all duration-500 relative rounded-xl ${
              tool === "deepfake" ? "border-neon-purple/50 shadow-glow-purple" : "hover:border-muted-foreground/30"
            }`}
          >
            <GlowingEffect
              spread={40}
              glow
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                <UserCircle className="w-5 h-5 text-neon-purple" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Deepfake Face Scanner</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a face image to detect AI generation artifacts, GAN fingerprints, and manipulation boundaries.
            </p>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => switchTool("credibility")}
            className={`glass-card p-6 text-left transition-all duration-500 relative rounded-xl ${
              tool === "credibility" ? "border-neon-cyan/50 shadow-glow-cyan" : "hover:border-muted-foreground/30"
            }`}
          >
            <GlowingEffect
              spread={40}
              glow
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 flex items-center justify-center">
                <Globe className="w-5 h-5 text-neon-cyan" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">Source Credibility AI</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Paste a news domain to analyze its reliability, bias index, fact-check record, and trust score.
            </p>
          </motion.button>
        </div>

        {/* Scanner */}
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
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className={`absolute inset-0 rounded-full border-2 ${tool === "deepfake" ? "border-neon-purple/50 border-t-neon-purple" : "border-neon-cyan/50 border-t-neon-cyan"}`}
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 rounded-full border-2 border-neon-blue/50 border-t-neon-blue"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className={`absolute inset-8 rounded-full border-2 ${tool === "deepfake" ? "border-neon-cyan/50 border-t-neon-cyan" : "border-neon-purple/50 border-t-neon-purple"}`}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {tool === "deepfake" ? (
                      <UserCircle className="w-8 h-8 text-neon-purple animate-glow-pulse" />
                    ) : (
                      <Search className="w-8 h-8 text-neon-cyan animate-glow-pulse" />
                    )}
                  </div>
                </div>
                <p className="mt-6 font-mono text-sm text-neon-cyan tracking-wider">
                  {tool === "deepfake" ? "ANALYZING FACIAL FEATURES..." : "EVALUATING SOURCE..."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="mb-6">
            <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
              {tool === "deepfake" ? "Upload Face Image" : "Enter News Domain"}
            </label>
            {tool === "deepfake" ? (
              <div
                className="w-full h-36 bg-muted/30 border-2 border-dashed border-border rounded-xl flex items-center justify-center cursor-pointer hover:border-neon-purple/40 transition-all duration-300"
                onClick={() => setInputValue("face_photo.jpg")}
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload a face image</p>
                  {inputValue && <p className="text-xs text-neon-purple mt-1 font-mono">{inputValue}</p>}
                </div>
              </div>
            ) : (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. reuters.com, example-news.xyz"
                className="w-full bg-muted/30 border border-border rounded-xl p-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/40 focus:shadow-glow-cyan transition-all duration-300 font-mono text-sm"
              />
            )}
          </div>

          {/* Scan button */}
          <div className="flex gap-4">
            <button
              onClick={handleScan}
              disabled={!inputValue.trim() || status === "scanning"}
              className="flex-1 group relative px-6 py-3 rounded-xl font-display text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <div className={`absolute inset-0 opacity-90 group-hover:opacity-100 transition-opacity ${
                tool === "deepfake"
                  ? "bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan"
                  : "bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple"
              }`} />
              <span className="relative z-10 flex items-center justify-center gap-2 text-primary-foreground">
                <Scan className="w-4 h-4" />
                {status === "scanning" ? "Analyzing..." : tool === "deepfake" ? "Scan Face" : "Check Source"}
              </span>
            </button>
            {status === "done" && (
              <button onClick={handleReset} className="px-6 py-3 rounded-xl font-display text-sm tracking-wider uppercase border border-border text-muted-foreground hover:border-neon-cyan/40 transition-all duration-300">
                Reset
              </button>
            )}
          </div>

          {/* Deepfake Results */}
          <AnimatePresence>
            {status === "done" && deepfakeResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className={`relative w-36 h-36 rounded-full flex items-center justify-center bg-gradient-to-br ${getScoreBg(deepfakeResult.score)} ${getScoreGlow(deepfakeResult.score)}`}>
                    <div className="text-center">
                      <div className={`text-4xl font-display font-bold ${getScoreColor(deepfakeResult.score)}`}>{deepfakeResult.score}</div>
                      <div className="text-xs font-mono text-muted-foreground mt-1">AUTHENTICITY</div>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <h3 className={`text-2xl font-display font-bold mb-4 ${getScoreColor(deepfakeResult.score)}`}>{deepfakeResult.label}</h3>
                    <div className="space-y-3">
                      {deepfakeResult.artifacts.map((a, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-3 flex items-start gap-3">
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border shrink-0 mt-0.5 ${severityColors[a.severity]}`}>{a.severity}</span>
                          <div>
                            <div className="text-sm font-semibold text-foreground">{a.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{a.detail}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Credibility Results */}
          <AnimatePresence>
            {status === "done" && credibilityResult && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8">
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-8" />
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className={`relative w-36 h-36 rounded-full flex items-center justify-center bg-gradient-to-br ${getScoreBg(credibilityResult.score)} ${getScoreGlow(credibilityResult.score)}`}>
                    <div className="text-center">
                      <div className={`text-4xl font-display font-bold ${getScoreColor(credibilityResult.score)}`}>{credibilityResult.score}</div>
                      <div className="text-xs font-mono text-muted-foreground mt-1">CREDIBILITY</div>
                    </div>
                  </div>
                  <div className="flex-1 w-full">
                    <h3 className={`text-2xl font-display font-bold mb-4 ${getScoreColor(credibilityResult.score)}`}>{credibilityResult.label}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {credibilityResult.factors.map((f, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full ${statusDots[f.status]}`} />
                            <span className="text-xs font-mono text-muted-foreground uppercase">{f.name}</span>
                          </div>
                          <div className={`text-sm font-semibold ${statusColors[f.status]}`}>{f.value}</div>
                        </motion.div>
                      ))}
                    </div>
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
