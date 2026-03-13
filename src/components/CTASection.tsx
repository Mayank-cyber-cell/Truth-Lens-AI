import { motion } from "framer-motion";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";

export default function CTASection() {
  return (
    <section className="relative py-32 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 md:p-16 relative overflow-hidden"
        >
          {/* Background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-[80px]" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="gradient-text">Start Detecting Now</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10">
              Join thousands of journalists, researchers, and citizens fighting
              misinformation with AI-powered truth detection.
            </p>
            <a href="#detector" title="Open the scanner section">
              <InteractiveHoverButton
                text="Launch Scanner"
                className="border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan font-display text-sm tracking-wider uppercase hover:shadow-glow-cyan"
              />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
