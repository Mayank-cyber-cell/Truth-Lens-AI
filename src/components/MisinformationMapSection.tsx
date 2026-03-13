import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Hotspot {
  id: number;
  positionClass: string;
  label: string;
  intensity: "high" | "medium" | "low";
}

const hotspots: Hotspot[] = [
  { id: 1, positionClass: "left-[25%] top-[30%]", label: "Eastern Europe: Political disinfo", intensity: "high" },
  { id: 2, positionClass: "left-[75%] top-[35%]", label: "East Asia: Deepfake surge", intensity: "high" },
  { id: 3, positionClass: "left-[20%] top-[45%]", label: "North America: Election misinfo", intensity: "medium" },
  { id: 4, positionClass: "left-[50%] top-[55%]", label: "Africa: Health misinfo", intensity: "medium" },
  { id: 5, positionClass: "left-[55%] top-[30%]", label: "Middle East: Conflict disinfo", intensity: "high" },
  { id: 6, positionClass: "left-[85%] top-[60%]", label: "Oceania: Climate disinfo", intensity: "low" },
  { id: 7, positionClass: "left-[35%] top-[65%]", label: "South America: Financial scams", intensity: "medium" },
];

const intensityColors = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

export default function MisinformationMapSection() {
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [alertCount, setAlertCount] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlertCount((c) => c + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="map" className="relative py-32 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="gradient-text">Global Misinformation Map</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Real-time tracking of misinformation hotspots worldwide.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-8 relative overflow-hidden"
        >
          {/* Stats bar */}
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
              <span className="font-mono text-sm text-neon-cyan">LIVE</span>
            </div>
            <div className="flex gap-6 text-sm font-mono text-muted-foreground">
              <span>Alerts today: <span className="text-neon-cyan">{alertCount.toLocaleString()}</span></span>
              <span>Active regions: <span className="text-neon-purple">7</span></span>
            </div>
          </div>

          {/* Map area */}
          <div className="relative w-full aspect-[2/1] bg-muted/20 rounded-xl border border-border overflow-hidden">
            {/* Grid overlay */}
            <div className="map-grid-pattern" />

            {/* Hotspot pins */}
            {hotspots.map((spot) => (
              <div
                key={spot.id}
                className={`absolute cursor-pointer group -translate-x-1/2 -translate-y-1/2 ${spot.positionClass}`}
                onMouseEnter={() => setActiveHotspot(spot.id)}
                onMouseLeave={() => setActiveHotspot(null)}
              >
                {/* Pulse rings */}
                <div className={`absolute inset-0 w-4 h-4 rounded-full ${intensityColors[spot.intensity]} opacity-30 pulse-ring`} />
                <div className={`relative w-3 h-3 rounded-full ${intensityColors[spot.intensity]} border-2 border-background z-10`} />

                {/* Tooltip */}
                {activeHotspot === spot.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-2 rounded-lg bg-card border border-border text-xs font-mono whitespace-nowrap z-20 shadow-glow-cyan"
                  >
                    {spot.label}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-card border-r border-b border-border rotate-45 -mt-1" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex gap-6 mt-4 justify-center text-xs font-mono text-muted-foreground">
            {(["high", "medium", "low"] as const).map((level) => (
              <div key={level} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${intensityColors[level]}`} />
                <span className="capitalize">{level} risk</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
