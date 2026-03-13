import { motion, useScroll, useTransform } from "framer-motion";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { Suspense, lazy, useRef } from "react";

const GlobeScene = lazy(() => import("./GlobeScene"));

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const globeScale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Globe Background with parallax scale */}
      <motion.div style={{ scale: globeScale }} className="absolute inset-0">
        <Suspense fallback={<div className="absolute inset-0 bg-background" />}>
          <GlobeScene />
        </Suspense>
      </motion.div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background z-[1]" />
      <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/5 via-transparent to-neon-cyan/5 z-[1]" />

      {/* Content with parallax */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-neon-cyan/30 bg-neon-cyan/5 text-neon-cyan text-sm font-mono tracking-wider">
            AI-POWERED TRUTH DETECTION
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight"
        >
          <span className="gradient-text">See the Truth.</span>
          <br />
          <span className="text-foreground">Detect the Fake.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light"
        >
          TruthLens AI uses advanced artificial intelligence to detect fake news,
          deepfake videos, manipulated images, and AI-generated text in real-time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#detector"
            title="Jump to the content scanner"
            className="group relative px-8 py-4 rounded-xl font-display text-sm tracking-wider uppercase overflow-hidden transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan opacity-0 group-hover:opacity-50 blur-xl transition-opacity" />
            <span className="relative z-10 text-primary-foreground">Scan Content</span>
          </a>
          <a href="#how-it-works" title="See how TruthLens works">
            <InteractiveHoverButton
              text="Try Demo"
              className="border-glass-border bg-glass/30 backdrop-blur-sm text-foreground font-display text-sm tracking-wider uppercase"
            />
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-1 rounded-full bg-neon-cyan"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
