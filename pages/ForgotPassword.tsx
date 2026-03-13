import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Mail, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const TruthLensLogo = () => (
  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-purple via-neon-blue to-neon-cyan">
    <Shield className="h-4 w-4 text-primary-foreground" />
  </div>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
      toast.success("Password reset link sent!");
    }
  };

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
          {sent ? (
            <div className="text-center space-y-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto w-20 h-20 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center"
              >
                <Mail className="w-10 h-10 text-neon-cyan" />
              </motion.div>
              <div className="space-y-2">
                <h1 className="text-3xl font-display font-bold text-foreground">Check Your Inbox</h1>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We sent a password reset link to{" "}
                  <strong className="text-foreground font-mono">{email}</strong>
                </p>
              </div>
              <div className="rounded-xl border border-border bg-muted/30 p-4 text-left space-y-2">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">Check your spam/junk folder if you don't see it</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">The link expires in 24 hours</p>
                </div>
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-neon-cyan hover:text-neon-cyan/80 transition-colors font-mono"
              >
                Didn't receive it? Send again →
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <h1 className="text-3xl font-display font-bold text-foreground">
                  Reset <span className="gradient-text">Password</span>
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email to receive a reset link
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="agent@truthlens.ai"
                  autoFocus
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
                      Send Reset Link
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <div className="text-center">
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-neon-cyan transition-colors font-mono"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
