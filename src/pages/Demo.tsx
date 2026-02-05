import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Demo = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-5xl font-rajdhani font-bold text-foreground mb-6">
            Interactive Demo
          </h1>
          <p className="text-lg text-muted-foreground">
            Demo content will be built here incrementally.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Demo;
