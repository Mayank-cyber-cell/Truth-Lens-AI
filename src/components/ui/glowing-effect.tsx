"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import { animate } from "motion/react";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

const GlowingEffect = memo(
  ({
    blur = 0,
    variant = "default",
    glow = false,
    className,
    borderWidth = 1,
    disabled = true,
  }: GlowingEffectProps) => {
    const glowPalette = variant === "white"
      ? "from-white/0 via-white/70 to-white/0"
      : "from-neon-purple/0 via-neon-cyan/80 to-neon-blue/0";
    const blurClass = blur > 0 ? "blur-sm" : "";
    const insetClass = borderWidth > 1 ? "-inset-[2px]" : "-inset-px";
    const opacityClass = disabled ? "opacity-0" : glow ? "opacity-100" : "opacity-70";

    return (
      <>
        <div
          className={cn(
            "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity",
            glow && "opacity-100",
            variant === "white" && "border-white",
            disabled && "!block"
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity",
            opacityClass,
            className,
            disabled && "!hidden"
          )}
        >
          <div
            className={cn(
              "absolute rounded-[inherit] bg-gradient-to-r",
              insetClass,
              glowPalette,
              blurClass,
              "transition-opacity duration-300"
            )}
          />
        </div>
      </>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };
