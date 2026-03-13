import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingTier {
  name: string;
  icon: React.ReactNode;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  color: string;
}

function CreativePricing({
  tag = "Simple Pricing",
  title = "Make Short Videos That Pop",
  description = "Edit, enhance, and go viral in minutes",
  tiers,
}: {
  tag?: string;
  title?: string;
  description?: string;
  tiers: PricingTier[];
}) {
  return (
    <div className="relative w-full overflow-hidden py-20 px-4">
      {/* Header */}
      <div className="relative z-10 mx-auto max-w-3xl text-center mb-16">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
          {tag}
        </div>
        <div className="relative">
          <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {title}
            <span className="absolute -right-6 -top-4 text-2xl animate-bounce">
              ✨
            </span>
            <span className="absolute -left-4 top-0 text-lg opacity-60 animate-pulse">
              ⭐️
            </span>
          </h2>
          <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        </div>
        <p className="mt-6 text-lg text-muted-foreground">
          {description}
        </p>
      </div>

      {/* Pricing cards */}
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            className={cn(
              "group relative rounded-3xl transition-all duration-500",
              tier.popular && "md:-mt-4 md:mb-4"
            )}
          >
            {/* Gradient border */}
            <div
              className={cn(
                "absolute -inset-px rounded-3xl opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100",
                tier.color === "amber" && "bg-gradient-to-br from-amber-400 to-orange-500",
                tier.color === "blue" && "bg-gradient-to-br from-blue-400 to-cyan-500",
                tier.color === "purple" && "bg-gradient-to-br from-purple-400 to-pink-500"
              )}
            />

            <div
              className={cn(
                "relative flex h-full flex-col rounded-3xl border bg-card p-8 backdrop-blur-sm transition-all duration-500",
                tier.popular
                  ? "border-primary/30 shadow-lg shadow-primary/10"
                  : "border-border hover:border-primary/20"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-1 text-xs font-semibold text-white shadow-md">
                  Popular!
                </div>
              )}

              <div className="mb-6">
                <div
                  className={cn(
                    "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl",
                    tier.color === "amber" && "bg-amber-500/10 text-amber-500",
                    tier.color === "blue" && "bg-blue-500/10 text-blue-500",
                    tier.color === "purple" && "bg-purple-500/10 text-purple-500"
                  )}
                >
                  {tier.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {tier.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className="mb-6 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tight text-foreground">
                  ${tier.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  /month
                </span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <div
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        tier.color === "amber" && "bg-amber-500/10 text-amber-500",
                        tier.color === "blue" && "bg-blue-500/10 text-blue-500",
                        tier.color === "purple" && "bg-purple-500/10 text-purple-500"
                      )}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                    <span className="text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "w-full rounded-xl font-semibold transition-all duration-300",
                  tier.popular
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:opacity-90 shadow-md"
                    : "bg-muted text-foreground hover:bg-muted/80"
                )}
                size="lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative elements */}
      <div className="pointer-events-none absolute bottom-10 left-10 text-6xl opacity-10 rotate-12">
        ✎
      </div>
      <div className="pointer-events-none absolute top-20 right-16 text-4xl opacity-10 -rotate-6">
        ✏️
      </div>
    </div>
  );
}

export { CreativePricing };
export type { PricingTier };
