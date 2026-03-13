import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import type { Database, Json } from "@/integrations/supabase/types";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  Shield, Send, Bot, User, Loader2, Plus,
  History, MessageSquare, LogOut
} from "lucide-react";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };
type ChatStreamChunk = {
  choices?: Array<{
    delta?: {
      content?: string;
    };
  }>;
};
type ScanHistoryRow = Database["public"]["Tables"]["scan_history"]["Row"];
type GuestScanEntry = {
  id: string;
  content: string;
  content_type: string;
  credibility_score: number;
  result: Json;
  created_at: string;
};

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const GUEST_HISTORY_KEY = "truthlens-guest-history";

function isGuestHistoryEntry(value: unknown): value is GuestScanEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return typeof entry.id === "string"
    && typeof entry.content === "string"
    && typeof entry.content_type === "string"
    && typeof entry.credibility_score === "number"
    && typeof entry.created_at === "string"
    && entry.result !== undefined;
}

function loadGuestHistory(): ScanHistoryRow[] {
  const raw = window.localStorage.getItem(GUEST_HISTORY_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isGuestHistoryEntry).map((entry) => ({
      id: entry.id,
      content: entry.content,
      content_type: entry.content_type,
      credibility_score: entry.credibility_score,
      created_at: entry.created_at,
      result: entry.result,
      user_id: "guest",
    }));
  } catch {
    return [];
  }
}

function getScanVerdict(result: Json): string {
  if (result && typeof result === "object" && !Array.isArray(result)) {
    const verdict = (result as Record<string, unknown>).verdict;
    if (typeof verdict === "string") {
      return verdict;
    }
  }

  return "analyzed";
}

async function streamChat({
  messages,
  onDelta,
  onDone,
}: {
  messages: Msg[];
  onDelta: (t: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (!resp.ok || !resp.body) {
    if (resp.status === 429) throw new Error("Rate limit exceeded. Please wait a moment.");
    if (resp.status === 402) throw new Error("AI usage limit reached. Please add credits.");
    throw new Error("Failed to start stream");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  let done = false;

  while (!done) {
    const { done: d, value } = await reader.read();
    if (d) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { done = true; break; }
      try {
        const parsed = JSON.parse(json) as ChatStreamChunk;
        const c = parsed.choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch {
        buf = line + "\n" + buf;
        break;
      }
    }
  }

  onDone();
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "history">("chat");
  const [scanHistory, setScanHistory] = useState<ScanHistoryRow[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (activeTab !== "history") {
      return;
    }

    if (!user) {
      setScanHistory(loadGuestHistory());
      return;
    }

    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("scan_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) {
        setScanHistory([]);
        return;
      }

      if (data) {
        setScanHistory(data);
      }
    };

    void fetchHistory();
  }, [activeTab, user]);

  const send = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsert,
        onDone: () => setIsLoading(false),
      });
    } catch (error: unknown) {
      setIsLoading(false);
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message);
    }
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict === "credible" || verdict === "mostly_credible") return "text-green-400";
    if (verdict === "mixed") return "text-yellow-400";
    return "text-red-400";
  };

  const handleSignOut = async () => {
    if (!user) {
      toast.info("You are already in guest mode");
      return;
    }

    await signOut();
    toast.success("Signed out successfully");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 border-r border-glass-border p-4 flex flex-col">
        <a href="/" className="flex items-center gap-2 mb-8">
          <Shield className="w-6 h-6 text-neon-cyan" />
          <span className="font-display text-sm font-bold gradient-text">TruthLens AI</span>
        </a>

        <nav className="space-y-1 flex-1">
          <button
            onClick={() => setActiveTab("chat")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-colors ${
              activeTab === "chat" ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            AI Chat
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-mono transition-colors ${
              activeTab === "history" ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            <History className="w-4 h-4" />
            Scan History
          </button>
        </nav>

        <div className="border-t border-glass-border pt-4">
          {user ? (
            <>
              <div className="px-1 pb-3">
                <div className="text-xs font-mono text-muted-foreground">Signed in as</div>
                <div className="mt-1 truncate text-sm text-foreground">{user.email}</div>
              </div>
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-mono text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </>
          ) : (
            <div className="px-1 pb-1 text-xs font-mono text-muted-foreground">Guest mode enabled with local scan history</div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {activeTab === "chat" ? (
          <>
            {/* Chat header */}
            <div className="border-b border-glass-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-neon-cyan" />
                <div>
                  <h2 className="font-display text-sm font-bold">TruthLens Agent</h2>
                  <p className="text-xs text-muted-foreground font-mono">Fact-checking & misinformation detection</p>
                </div>
              </div>
              <button
                onClick={() => setMessages([])}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                title="New conversation"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <Bot className="w-12 h-12 text-neon-cyan/30 mb-4" />
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">Ask TruthLens AI</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Ask about fact-checking, source credibility, deepfakes, AI-generated content, or paste any claim for analysis.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-6 justify-center">
                    {["Is this claim true?", "How to spot deepfakes?", "Check source credibility"].map((q) => (
                      <button
                        key={q}
                        onClick={() => { setInput(q); }}
                        className="px-3 py-1.5 rounded-full border border-glass-border text-xs font-mono text-muted-foreground hover:text-neon-cyan hover:border-neon-cyan/30 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-7 h-7 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-neon-cyan" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-xl px-4 py-3 text-sm ${
                      msg.role === "user"
                        ? "bg-neon-purple/10 border border-neon-purple/20 text-foreground"
                        : "glass-card text-foreground"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-neon-purple" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-neon-cyan" />
                  </div>
                  <div className="glass-card px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" />
                    <span className="text-xs text-muted-foreground font-mono">Analyzing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-glass-border p-4">
              <form
                onSubmit={(e) => { e.preventDefault(); send(); }}
                className="flex gap-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about misinformation, paste a claim..."
                  className="flex-1 px-4 py-3 bg-muted/50 border border-glass-border rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/30 transition-colors text-sm"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  title="Send message"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-neon-purple to-neon-cyan text-primary-foreground disabled:opacity-50 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          /* Scan History */
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Scan History</h2>
            {scanHistory.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="font-mono text-sm">No scans yet. Use the scanner on the homepage to analyze content.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {scanHistory.map((scan) => (
                  <div key={scan.id} className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-muted-foreground uppercase">{scan.content_type}</span>
                      <span className={`text-sm font-display font-bold ${
                        (scan.credibility_score ?? 0) >= 70 ? "text-green-400" :
                        (scan.credibility_score ?? 0) >= 40 ? "text-yellow-400" : "text-red-400"
                      }`}>
                        {scan.credibility_score ?? "—"}/100
                      </span>
                    </div>
                    <p className="text-sm text-foreground line-clamp-2 mb-2">{scan.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(scan.created_at).toLocaleDateString()} · {getScanVerdict(scan.result)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
