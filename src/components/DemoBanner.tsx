import { Link } from "react-router-dom";

const DemoBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-pink-500/10 to-cyan-500/10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-rajdhani font-bold text-foreground mb-4">
          Try the Interactive Demo
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Experience AI capabilities hands-on
        </p>
        <Link
          to="/demo"
          className="btn-hero px-8 py-4 text-base font-montserrat inline-flex items-center gap-2"
        >
          Launch Demo →
        </Link>
      </div>
    </section>
  );
};

export default DemoBanner;
