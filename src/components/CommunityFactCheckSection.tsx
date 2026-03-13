import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flag,
  ThumbsUp,
  ThumbsDown,
  Send,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  TrendingUp,
  Users,
} from "lucide-react";

interface Report {
  id: number;
  title: string;
  url: string;
  category: string;
  reportedBy: string;
  trustBadge: "verified" | "contributor" | "new";
  votesReal: number;
  votesFake: number;
  sources: number;
  timeAgo: string;
}

const initialReports: Report[] = [
  {
    id: 1,
    title: "Viral photo of 'alien spacecraft' over Tokyo",
    url: "example.com/alien-tokyo",
    category: "Manipulated Image",
    reportedBy: "TruthSeeker42",
    trustBadge: "verified",
    votesReal: 12,
    votesFake: 187,
    sources: 5,
    timeAgo: "2h ago",
  },
  {
    id: 2,
    title: "Celebrity deepfake video endorsing crypto scam",
    url: "example.com/celeb-crypto",
    category: "Deepfake",
    reportedBy: "FactHunter",
    trustBadge: "contributor",
    votesReal: 3,
    votesFake: 241,
    sources: 8,
    timeAgo: "4h ago",
  },
  {
    id: 3,
    title: "News article claiming new miracle cure",
    url: "example.com/miracle-cure",
    category: "Fake News",
    reportedBy: "MediaWatch",
    trustBadge: "verified",
    votesReal: 45,
    votesFake: 89,
    sources: 3,
    timeAgo: "6h ago",
  },
  {
    id: 4,
    title: "AI-generated audio of political figure",
    url: "example.com/ai-audio",
    category: "AI Generated",
    reportedBy: "NewUser99",
    trustBadge: "new",
    votesReal: 8,
    votesFake: 56,
    sources: 2,
    timeAgo: "8h ago",
  },
];

const badgeConfig = {
  verified: { label: "Verified", color: "text-neon-cyan", bg: "bg-neon-cyan/10 border-neon-cyan/30" },
  contributor: { label: "Contributor", color: "text-neon-purple", bg: "bg-neon-purple/10 border-neon-purple/30" },
  new: { label: "New", color: "text-muted-foreground", bg: "bg-muted/40 border-border" },
};

const categoryColors: Record<string, string> = {
  "Manipulated Image": "text-destructive bg-destructive/10 border-destructive/30",
  Deepfake: "text-neon-purple bg-neon-purple/10 border-neon-purple/30",
  "Fake News": "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  "AI Generated": "text-neon-blue bg-neon-blue/10 border-neon-blue/30",
};

function ReportCard({ report, onVote }: { report: Report; onVote: (id: number, type: "real" | "fake") => void }) {
  const total = report.votesReal + report.votesFake;
  const fakePercent = total > 0 ? (report.votesFake / total) * 100 : 50;
  const realScale = (100 - fakePercent) / 100;
  const fakeScale = fakePercent / 100;
  const badge = badgeConfig[report.trustBadge];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-5 hover:border-neon-cyan/30 transition-all duration-500 group"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border ${categoryColors[report.category] || "text-muted-foreground"}`}>
              {report.category}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">{report.timeAgo}</span>
          </div>
          <h4 className="text-sm font-semibold text-foreground leading-snug mb-1 truncate">{report.title}</h4>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <span>by</span>
            <span className="font-mono text-foreground/80">{report.reportedBy}</span>
            <span className={`px-1.5 py-0.5 rounded-full border text-[9px] font-mono uppercase ${badge.bg} ${badge.color}`}>
              {badge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Vote bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] font-mono mb-1">
          <span className="text-green-400">REAL {report.votesReal}</span>
          <span className="text-destructive">FAKE {report.votesFake}</span>
        </div>
        <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            animate={{ scaleX: realScale }}
            transition={{ duration: 0.5 }}
            className="absolute inset-y-0 left-0 w-full origin-left bg-green-400/80"
          />
          <motion.div
            animate={{ scaleX: fakeScale }}
            transition={{ duration: 0.5 }}
            className="absolute inset-y-0 right-0 w-full origin-right bg-destructive/80"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onVote(report.id, "real")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-mono bg-green-400/10 border border-green-400/20 text-green-400 hover:bg-green-400/20 transition-colors"
        >
          <ThumbsUp className="w-3 h-3" /> Real
        </button>
        <button
          onClick={() => onVote(report.id, "fake")}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-mono bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-colors"
        >
          <ThumbsDown className="w-3 h-3" /> Fake
        </button>
        <div className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
          <ExternalLink className="w-3 h-3" />
          {report.sources} sources
        </div>
      </div>
    </motion.div>
  );
}

export default function CommunityFactCheckSection() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [showForm, setShowForm] = useState(false);
  const [formUrl, setFormUrl] = useState("");
  const [formReason, setFormReason] = useState("");
  const [formCategory, setFormCategory] = useState("Fake News");

  const handleVote = (id: number, type: "real" | "fake") => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, votesReal: r.votesReal + (type === "real" ? 1 : 0), votesFake: r.votesFake + (type === "fake" ? 1 : 0) }
          : r
      )
    );
  };

  const handleSubmit = () => {
    if (!formUrl.trim()) return;
    const newReport: Report = {
      id: Date.now(),
      title: formReason || formUrl,
      url: formUrl,
      category: formCategory,
      reportedBy: "You",
      trustBadge: "new",
      votesReal: 0,
      votesFake: 1,
      sources: 0,
      timeAgo: "Just now",
    };
    setReports((prev) => [newReport, ...prev]);
    setFormUrl("");
    setFormReason("");
    setShowForm(false);
  };

  return (
    <section id="community" className="relative py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Community Fact Check</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Crowdsourced truth. Report suspicious content, vote on authenticity, and build your reputation.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {[
            { icon: Flag, label: "Reports", value: "12,847" },
            { icon: Users, label: "Contributors", value: "3,291" },
            { icon: CheckCircle2, label: "Verified Fake", value: "8,104" },
            { icon: TrendingUp, label: "Accuracy", value: "94.2%" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-4 text-center">
              <stat.icon className="w-5 h-5 text-neon-cyan mx-auto mb-2" />
              <div className="text-xl font-display font-bold text-foreground">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground font-mono uppercase">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Report button */}
        <div className="flex justify-center mb-8">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-display text-sm tracking-wider uppercase bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan hover:shadow-glow-cyan transition-all duration-300"
          >
            <AlertTriangle className="w-4 h-4" />
            Report Suspicious Content
          </motion.button>
        </div>

        {/* Report form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              <div className="glass-card p-6 max-w-2xl mx-auto space-y-4">
                <h3 className="font-display text-sm font-semibold text-foreground uppercase tracking-wider">
                  Submit a Report
                </h3>
                <input
                  type="url"
                  placeholder="Paste suspicious URL..."
                  value={formUrl}
                  onChange={(e) => setFormUrl(e.target.value)}
                  className="w-full bg-muted/40 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50 transition-colors font-mono"
                />
                <div className="flex gap-2 flex-wrap">
                  {["Fake News", "Deepfake", "Manipulated Image", "AI Generated"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFormCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-mono border transition-colors ${
                        formCategory === cat
                          ? "border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan"
                          : "border-border bg-muted/20 text-muted-foreground hover:border-border"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Why do you think this is suspicious? (optional)"
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  rows={2}
                  className="w-full bg-muted/40 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50 transition-colors resize-none"
                />
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-display tracking-wider uppercase bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" /> Submit Report
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reports grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} onVote={handleVote} />
          ))}
        </div>

        {/* Reputation info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 glass-card p-6 max-w-2xl mx-auto text-center"
        >
          <Shield className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">Build Your Trust Score</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Report content, vote accurately, and contribute sources to earn trust badges.
            Verified contributors' votes carry more weight in the community consensus.
          </p>
          <div className="flex justify-center gap-4 mt-4">
            {Object.entries(badgeConfig).map(([key, val]) => (
              <div key={key} className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-mono uppercase ${val.bg} ${val.color}`}>
                {val.label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
