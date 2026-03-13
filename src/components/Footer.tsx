import { motion } from "framer-motion";
import { Github, Twitter, Mail, Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative py-16 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-neon-cyan" />
              <span className="font-display text-xl font-bold gradient-text">TruthLens AI</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Fighting misinformation with cutting-edge AI. Our mission is to make truth
              accessible and manipulation detectable for everyone.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#detector" className="hover:text-neon-cyan transition-colors">AI Scanner</a></li>
              <li><a href="#how-it-works" className="hover:text-neon-cyan transition-colors">How It Works</a></li>
              <li><a href="#map" className="hover:text-neon-cyan transition-colors">Live Map</a></li>
              <li><a href="#education" className="hover:text-neon-cyan transition-colors">Education</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold mb-4 text-foreground">Connect</h4>
            <div className="flex gap-3">
              {[
                { icon: Github, href: "https://github.com/Mayank-cyber-cell" },
                { icon: Twitter, href: "#" },
                { icon: Mail, href: "#" },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 rounded-xl bg-muted/30 border border-border flex items-center justify-center text-muted-foreground hover:border-neon-cyan/40 hover:text-neon-cyan hover:shadow-glow-cyan transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-mono">
          <span>© 2026 TruthLens AI. All rights reserved.</span>
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
