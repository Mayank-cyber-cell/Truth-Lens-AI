import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, ArrowRight, Eye, EyeOff, PartyPopper } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

const TruthLensLogo = () => (
  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-purple via-neon-blue to-neon-cyan">
    <Shield className="h-4 w-4 text-primary-foreground" />
  </div>
);

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setIsRecovery(true);
    });
    const hash = window.location.hash;
    if (hash && hash.includes("type=recovery")) setIsRecovery(true);
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error("Passwords do not match"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/dashboard", { replace: true }), 2000);
    }
  };

  // Invalid link state
  if (!isRecovery && !success) {
    return (
      <div className="flex min-h-screen w-full">
        <div className="relative hidden w-1/2 overflow-hidden bg-background lg:flex lg:flex-col lg:justify-between p-10">
          <div className="relative z-10 flex items-center gap-3">
            <TruthLensLogo />
            <span className="font-display text-xl font-bold gradient-text">TruthLens AI</span>
          </div>
          <div className="relative z-10 max-w-md">
            <blockquote className="text-lg font-display text-foreground/80 leading-relaxed italic">
              "This platform has revolutionized how I verify information. Fast, accurate, and indispensable."
            </blockquote>
            <p className="mt-4 text-sm text-muted-foreground font-mono">~ A TruthLens User</p>
          </div>
          <div className="relative z-10 flex gap-2">
            <div className="h-2 w-2 rounded-full bg-neon-cyan/60" />
            <div className="h-2 w-2 rounded-full bg-neon-purple/40" />
          </div>
        </div>

        <div className="relative flex w-full flex-col items-center justify-center bg-card p-6 lg:w-1/2">
          <div className="auth-grid-pattern" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-sm text-center space-y-6"
          >
            <div className="mx-auto w-20 h-20 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
              <Shield className="w-10 h-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold text-foreground">Invalid Reset Link</h1>
              <p className="text-sm text-muted-foreground">This link is invalid or has expired.</p>
            </div>
            <Link
              to="/forgot-password"
              className="inline-block text-sm text-neon-cyan hover:text-neon-cyan/80 transition-colors font-mono"
            >
              Request a new reset link →
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-background lg:flex lg:flex-col lg:justify-between p-10">
        <div className="relative z-10 flex items-center gap-3">
          <TruthLensLogo />
          <span className="font-display text-xl font-bold gradient-text">TruthLens AI</span>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative z-10 max-w-md"
        >
          <blockquote className="text-lg font-display text-foreground/80 leading-relaxed italic">
            "This platform has revolutionized how I verify information. Fast, accurate, and indispensable."
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground font-mono">~ A TruthLens User</p>
        </motion.div>
        <div className="relative z-10 flex gap-2">
          <div className="h-2 w-2 rounded-full bg-neon-cyan/60" />
          <div className="h-2 w-2 rounded-full bg-neon-purple/40" />
        </div>
      </div>

      {/* Right panel */}
      <div className="relative flex w-full flex-col items-center justify-center bg-card p-6 lg:w-1/2">
        <div className="auth-grid-pattern" />

        {/* Mobile logo */}
        <div className="absolute top-6 left-6 flex items-center gap-3 lg:hidden">
          <TruthLensLogo />
          <span className="font-display text-lg font-bold gradient-text">TruthLens AI</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-sm space-y-6"
        >
          {success ? (
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto w-20 h-20 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center"
              >
                <PartyPopper className="w-10 h-10 text-neon-cyan" />
              </motion.div>
              <div className="space-y-2">
                <h1 className="text-3xl font-display font-bold text-foreground">Password Updated</h1>
                <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h1 className="text-3xl font-display font-bold text-foreground">
                  Set New <span className="gradient-text">Password</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your new password below
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="New password"
                    autoFocus
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="Confirm password"
                  className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-lg font-display tracking-wider uppercase text-sm bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      Update Password
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
