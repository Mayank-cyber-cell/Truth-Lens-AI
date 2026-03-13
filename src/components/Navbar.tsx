import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Menu, X, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const navLinks = [
  { href: "#detector", label: "Scanner" },
  { href: "#tools", label: "AI Tools" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#map", label: "Live Map" },
  { href: "#education", label: "Learn" },
];

export default function Navbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-b border-border" : ""
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center">
        {/* Logo - left */}
        <a href="/" className="flex items-center gap-2 flex-shrink-0 w-1/4">
          <Shield className="w-5 h-5 text-neon-cyan" />
          <span className="font-display text-lg font-bold gradient-text">TruthLens AI</span>
        </a>

        {/* Desktop links - centered */}
        <div className="hidden md:flex items-center justify-center gap-5 flex-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-neon-cyan transition-colors font-mono"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right section */}
        <div className="hidden md:flex items-center justify-end gap-3 w-1/4">
          <ThemeToggle />
          <a
            href={user ? "/dashboard" : "/auth"}
            className="px-4 py-2 rounded-lg text-sm font-display tracking-wider uppercase bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan hover:shadow-glow-cyan transition-all duration-300 flex items-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            {user ? "Dashboard" : "Sign In"}
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden ml-auto text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border px-4 py-4 space-y-3"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm text-muted-foreground hover:text-neon-cyan transition-colors font-mono py-2"
            >
              {link.label}
            </a>
          ))}
          <div className="flex items-center justify-between py-2">
            <a href={user ? "/dashboard" : "/auth"} className="text-sm text-neon-cyan font-mono">
              {user ? "Dashboard" : "Sign In"}
            </a>
            <ThemeToggle />
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
