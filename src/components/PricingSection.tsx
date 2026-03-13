import { CreativePricing } from "@/components/ui/creative-pricing";
import type { PricingTier } from "@/components/ui/creative-pricing";
import { Shield, Sparkles, Zap } from "lucide-react";

const tiers: PricingTier[] = [
  {
    name: "Analyst",
    icon: <Shield className="w-6 h-6" />,
    price: 0,
    description: "For casual fact-checkers",
    color: "amber",
    features: [
      "10 Scans per day",
      "Basic Truth Score",
      "Link & Text Analysis",
      "Community Voting Access",
    ],
  },
  {
    name: "Investigator",
    icon: <Zap className="w-6 h-6" />,
    price: 29,
    description: "For journalists & researchers",
    color: "blue",
    features: [
      "Unlimited Scans",
      "Deepfake Face Scanner",
      "Source Credibility AI",
      "Detailed Forensic Reports",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    icon: <Sparkles className="w-6 h-6" />,
    price: 99,
    description: "For newsrooms & organizations",
    color: "purple",
    features: [
      "API Access & Webhooks",
      "Bulk Content Scanning",
      "Custom AI Model Training",
      "Priority Support & SLA",
    ],
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="relative py-16 px-4">
      <CreativePricing
        tag="Transparent Pricing"
        title="Choose Your Truth Plan"
        description="From casual fact-checking to enterprise-grade misinformation detection"
        tiers={tiers}
      />
    </section>
  );
}
