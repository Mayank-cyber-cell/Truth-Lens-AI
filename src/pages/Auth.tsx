import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield } from "lucide-react";
import { toast } from "sonner";
import { AuthPage } from "@/components/ui/auth-page";
import { motion } from "framer-motion";

const TruthLensLogo = () => (
  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-neon-purple via-neon-blue to-neon-cyan">
    <Shield className="h-4 w-4 text-primary-foreground" />
  </div>
);

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "password">("email");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }
    setStep("password");
  };

  const handlePasswordSubmit = async () => {
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    toast.success(isLogin ? "Signed in" : "Account created");
    navigate("/dashboard");
  };

  const handleGoogleLogin = async () => {
    toast.success("Google sign-in disabled in demo mode");
    navigate("/dashboard");
  }

  // Password step
  if (step === "password") {
    return (
      <div className="flex min-h-screen w-full">
        {/* Left panel */}
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

        {/* Right panel - password form */}
        <div className="relative flex w-full flex-col items-center justify-center bg-card p-6 lg:w-1/2">
          <div className="auth-grid-pattern" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 w-full max-w-sm space-y-6"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold text-foreground">
                {isLogin ? "Enter Password" : "Create Password"}
              </h1>
              <p className="text-sm text-muted-foreground font-mono">{email}</p>
            </div>

            <div className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                placeholder={isLogin ? "Your password" : "Create a password (min 6 chars)"}
                autoFocus
                className="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />

              <button
                onClick={handlePasswordSubmit}
                disabled={loading}
                className="w-full h-11 rounded-lg font-display tracking-wider uppercase text-sm bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </button>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => { setStep("email"); setPassword(""); }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-mono"
                >
                  ← Go back
                </button>
                {isLogin && (
                  <span className="text-sm text-muted-foreground font-mono">
                    Demo mode active
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <AuthPage
      logo={<TruthLensLogo />}
      brandName="TruthLens AI"
      email={email}
      onEmailChange={setEmail}
      onEmailSubmit={handleEmailSubmit}
      onGoogleClick={handleGoogleLogin}
      loading={loading}
      isLogin={isLogin}
      onToggleMode={() => setIsLogin(!isLogin)}
      onBackHome={() => navigate("/")}
    />
  );
}
