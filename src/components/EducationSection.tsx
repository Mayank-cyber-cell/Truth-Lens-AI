import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Eye, Share2, Bot } from "lucide-react";

const cards = [
  {
    icon: Eye,
    title: "What Are Deepfakes?",
    front: "AI-generated synthetic media that replaces a person's likeness in video or images.",
    back: "Deepfakes use Generative Adversarial Networks (GANs) to create realistic face swaps. Detection methods include analyzing blinking patterns, facial boundaries, and compression artifacts.",
  },
  {
    icon: Share2,
    title: "How Fake News Spreads",
    front: "Misinformation exploits social networks, emotional triggers, and confirmation bias.",
    back: "Studies show fake news spreads 6x faster than real news. Bots amplify false narratives and algorithmic recommendation systems create echo chambers that reinforce beliefs.",
  },
  {
    icon: Bot,
    title: "How AI Detects Manipulation",
    front: "Machine learning models analyze patterns invisible to the human eye.",
    back: "AI forensic tools examine pixel-level inconsistencies, metadata tampering, linguistic patterns, and cross-reference multiple databases to determine content authenticity.",
  },
];

function FlipCard({ card, index }: { card: typeof cards[0]; index: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="h-72 cursor-pointer"
    >
      <div
        onMouseEnter={() => {
          setFlipped(true);
        }}
        onMouseLeave={() => {
          setFlipped(false);
        }}
        onClick={() => setFlipped(!flipped)}
        className="w-full h-full"
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-full flip-card-3d"
        >
          {/* Front */}
          <div
            className="absolute inset-0 glass-card backface-hidden p-6 flex flex-col items-center justify-center text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/20 flex items-center justify-center mb-4">
              <card.icon className="w-7 h-7 text-neon-cyan" />
            </div>
            <h3 className="font-display text-lg font-semibold mb-3 text-foreground">{card.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{card.front}</p>
            <span className="mt-4 text-xs text-neon-cyan/60 font-mono">HOVER TO LEARN MORE</span>
          </div>
          {/* Back */}
          <div
            className="absolute inset-0 glass-card backface-hidden rotate-y-180 border-neon-cyan/30 p-6 flex flex-col items-center justify-center text-center"
          >
            <h3 className="font-display text-lg font-semibold mb-4 gradient-text">{card.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{card.back}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function EducationSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-40%", "40%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 0]);

  return (
    <section id="education" ref={sectionRef} className="relative py-32 px-4 overflow-hidden">
      {/* Parallax glow */}
      <motion.div
        style={{ y: bgY, opacity: glowOpacity }}
        className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-neon-cyan/6 rounded-full blur-[150px] pointer-events-none"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Understanding Misinformation</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Learn how deepfakes work and how AI fights back.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <FlipCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
