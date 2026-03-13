import { motion, useScroll, useTransform } from "framer-motion";
import { Scan, Brain, BarChart3, Shield } from "lucide-react";
import { useRef } from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

const steps = [
  {
    icon: Scan,
    title: "Submit Content",
    description: "Paste a link, upload an image or video, or enter text for analysis.",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our multi-model AI examines metadata, patterns, and source credibility.",
  },
  {
    icon: BarChart3,
    title: "Deep Forensics",
    description: "Frame-by-frame analysis, reverse image search, and NLP classification.",
  },
  {
    icon: Shield,
    title: "Truth Score",
    description: "Get a comprehensive score with detailed explanations of findings.",
  },
];

function TiltCard({ step, index }: { step: typeof steps[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      whileHover={{ y: -6, scale: 1.02 }}
    >
      <div
        className="glass-card-hover p-6 text-center group relative rounded-xl"
      >
        <GlowingEffect
          spread={40}
          glow
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={2}
        />
        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-neon-purple/20 border border-neon-purple/40 flex items-center justify-center font-mono text-xs text-neon-purple z-10">
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center mx-auto mb-5 group-hover:shadow-glow-cyan transition-shadow duration-500">
          <step.icon className="w-7 h-7 text-neon-cyan" />
        </div>
        <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{step.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.6, 0]);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-32 px-4 overflow-hidden">
      {/* Parallax background elements */}
      <motion.div
        style={{ y: bgY, opacity: glowOpacity }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/8 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        style={{ y: bgY, opacity: glowOpacity }}
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-neon-cyan/8 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">How It Works</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Four steps to uncover the truth behind any content.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <TiltCard key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
