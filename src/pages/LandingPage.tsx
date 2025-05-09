
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero Section */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-16 md:py-24">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(30,64,175,0.15),rgba(0,0,0,0)_50%)]"></div>
        
        <div className="container relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-6">
            <img
              src="/lovable-uploads/d7eb8650-e751-464c-83d1-5a89c3dd3b8e.png"
              alt="Hype Score Barometer Logo"
              className="h-32 w-32 md:h-40 md:w-40"
            />
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Let's get <span className="text-primary">hyped!</span>
            </h1>
            
            <p className="max-w-2xl text-xl md:text-2xl font-medium text-muted-foreground">
              Where sentiment meets strategy.
            </p>
          </div>
          
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" onClick={() => navigate("/dashboard")} className="group">
              Explore Dashboard
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/login")}>
              Login
            </Button>
          </div>
          
          <div className="mt-16 grid gap-8 md:mt-24 md:grid-cols-3">
            {[
              {
                title: "Real-time Sentiment Analysis",
                description: "Track market sentiment across social media platforms in real time."
              },
              {
                title: "Technical Indicators",
                description: "Combine technical analysis with sentiment data for better decisions."
              },
              {
                title: "Hype Score Metrics",
                description: "Quantified measurements of public interest in your favorite stocks."
              }
            ].map((feature, i) => (
              <div key={i} className="rounded-xl border bg-card p-6 text-left shadow-sm">
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            This information is not to be considered financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
