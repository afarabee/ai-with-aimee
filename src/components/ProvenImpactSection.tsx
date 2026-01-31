import { BarChart3, Stethoscope, Rocket, ShieldCheck } from "lucide-react";
import GlowCard from "./ui/glow-card";
import SectionDivider from "./SectionDivider";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const impactCategories = [
  {
    icon: ShieldCheck,
    title: "AI Transformation & Governance",
    items: [
      "Established AI governance frameworks for GxP, HIPAA, and GDPR compliance",
      "Directed enterprise-wide rollout of Microsoft Copilot, ChatGPT, and agentic AI workflows",
      "Built AI Champion Network to scale responsible adoption",
      "Delivered agentic AI workflows with RAG, integrating Azure DevOps and GitHub",
      "Evaluated 100+ AI use cases using strategic alignment, reusability, and ROI frameworks",
    ],
  },
  {
    icon: BarChart3,
    title: "Measurable Outcomes",
    items: [
      "98% reduction in pre-clinical draft reporting cycle time",
      "80% reduction in user story creation time across 20+ product teams",
      '97 days zero-to-one launch of CareNav+ "Future of Care" pilot',
      "72 hours guaranteed patient appointment scheduling (down from weeks)",
      "70% reduction in time-to-market through automated migration tooling",
      "~13 weeks of productive time recovered per product owner annually",
    ],
  },
  {
    icon: Stethoscope,
    title: "Healthcare Product Leadership",
    items: [
      "Launched consumer mobile apps and patient portals serving millions of members",
      "Built Remote Patient Monitoring platform with FHIR pipelines and wearable integrations",
      "Designed AI symptom checking and real-time clinician availability features",
      "Architected Behavioral Health API platform for secure partner integration",
      "Established cloud-based enterprise data repositories (first at Evernorth)",
      "Led digital transformation initiatives across Cigna, Evernorth, and Express Scripts",
    ],
  },
  {
    icon: Rocket,
    title: "Zero-to-One Track Record",
    items: [
      "7 zero-to-one deliveries in regulated healthcare and life sciences environments",
      "Established 3 Product Owner Communities of Practice to scale organizational capability",
      "16+ years translating complex technology into customer-centric experiences",
      "7+ years in product leadership roles managing cross-functional teams",
      "Led strategic initiatives from conception through enterprise-scale adoption",
    ],
  },
];

const ProvenImpactSection = () => {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section id="proven-impact" className="relative py-20 bg-gradient-to-b from-[#0f0b1d] to-background overflow-hidden">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-cyan-400/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-rajdhani font-bold uppercase tracking-wider neon-text-pink mb-4">
            Proven Impact
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-500 via-cyan-400 to-yellow-400 mx-auto rounded-full" />
        </div>

        {/* Impact Cards Grid */}
        <div ref={ref} className="grid md:grid-cols-2 gap-6">
          {impactCategories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <div
                key={index}
                className={`h-full opacity-0 ${isVisible ? 'animate-fade-up' : ''}`}
                style={{ 
                  animationDelay: isVisible ? `${index * 100}ms` : '0ms',
                  animationFillMode: 'forwards'
                }}
              >
                <GlowCard className="h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                      <IconComponent className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-rajdhani font-semibold uppercase tracking-wide neon-text-yellow">
                      {category.title}
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2 text-base font-ibm text-gray-300" style={{ lineHeight: '1.6' }}>
                        <span className="text-pink-400 mt-1 flex-shrink-0">▹</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </GlowCard>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section Divider */}
      <SectionDivider variant="wave" color="#0f0b1d" />
    </section>
  );
};

export default ProvenImpactSection;
