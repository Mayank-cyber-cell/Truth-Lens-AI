import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Shield, Eye, Cpu, BarChart3, Users, Zap } from "lucide-react";

const activityHeights = [
  "h-[34%]", "h-[57%]", "h-[75%]", "h-[71%]", "h-[58%]", "h-[31%]",
  "h-[19%]", "h-[26%]", "h-[52%]", "h-[72%]", "h-[88%]", "h-[73%]",
  "h-[48%]", "h-[24%]", "h-[13%]", "h-[18%]", "h-[39%]", "h-[68%]",
  "h-[87%]", "h-[80%]", "h-[63%]", "h-[35%]", "h-[19%]", "h-[12%]",
];

export default function ScrollShowcaseSection() {
  return (
    <section className="relative">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center">
            <span className="text-lg md:text-2xl font-body text-muted-foreground mb-4">
              Experience the future of
            </span>
            <h2 className="text-4xl md:text-7xl font-display font-bold">
              <span className="gradient-text">AI Truth Detection</span>
            </h2>
          </div>
        }
      >
        <div className="h-full w-full bg-gradient-to-br from-card via-background to-card p-6 md:p-10 flex flex-col justify-center gap-6">
          {/* Dashboard mockup */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-destructive" />
            <div className="w-3 h-3 rounded-full bg-[hsl(45,90%,50%)]" />
            <div className="w-3 h-3 rounded-full bg-[hsl(140,70%,45%)]" />
            <span className="ml-4 text-xs font-mono text-muted-foreground">
              truthlens-dashboard.app
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
            <DashboardCard
              icon={<Shield className="w-5 h-5 text-neon-cyan" />}
              label="Scans Today"
              value="12,847"
            />
            <DashboardCard
              icon={<Eye className="w-5 h-5 text-neon-purple" />}
              label="Deepfakes Found"
              value="342"
            />
            <DashboardCard
              icon={<Cpu className="w-5 h-5 text-neon-blue" />}
              label="AI Accuracy"
              value="99.2%"
            />
            <DashboardCard
              icon={<BarChart3 className="w-5 h-5 text-neon-cyan" />}
              label="Sources Verified"
              value="8,291"
            />
            <DashboardCard
              icon={<Users className="w-5 h-5 text-neon-purple" />}
              label="Active Users"
              value="54K+"
            />
            <DashboardCard
              icon={<Zap className="w-5 h-5 text-neon-blue" />}
              label="Avg Response"
              value="0.3s"
            />
          </div>

          {/* Fake activity bar */}
          <div className="h-16 md:h-24 rounded-xl bg-muted/50 border border-glass-border flex items-end gap-1 p-3">
            {activityHeights.map((heightClass, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t bg-gradient-to-t from-neon-purple to-neon-cyan opacity-60 ${heightClass}`}
              />
            ))}
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}

function AnimatedNumber({ value, suffix = "", decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.floor(display).toLocaleString();

  return <span ref={ref}>{formatted}{suffix}</span>;
}

function parseValue(value: string): { num: number; suffix: string; decimals: number } {
  const match = value.match(/^([\d,]+(?:\.(\d+))?)(.*)/);
  if (!match) return { num: 0, suffix: value, decimals: 0 };
  const decimals = match[2] ? match[2].length : 0;
  return { num: parseFloat(match[1].replace(/,/g, "")), suffix: match[3], decimals };
}

function DashboardCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const { num, suffix, decimals } = parseValue(value);
  return (
    <div className="glass-card p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-muted-foreground font-mono">{label}</span>
      </div>
      <span className="text-xl md:text-2xl font-display font-bold text-foreground">
        <AnimatedNumber value={num} suffix={suffix} decimals={decimals} />
      </span>
    </div>
  );
}
