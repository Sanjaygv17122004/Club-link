import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MessageCircle, Search, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Landing = () => {
  const features = [
    {
      icon: Globe,
      title: "Connect Globally",
      description: "Join clubs from universities worldwide and expand your network beyond campus boundaries."
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Engage with club members instantly through our advanced messaging system."
    },
    {
      icon: Search,
      title: "Smart Discovery",
      description: "Find clubs that match your interests using our intelligent recommendation engine."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-orbitron font-bold text-primary ">
              ClubLink
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link to="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="neon">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="hero-gradient absolute inset-0" />
        <div className="container relative z-10">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-orbitron font-bold tracking-tight">
                <span className="text-primary ">Club</span>
                <span className="text-foreground">Link</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Connect Beyond Limits
              </p>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                The modern platform for managing and exploring college clubs with real-time chat and smart discovery
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className=" animate-pulse group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

  

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center space-y-8 mb-16">
            <h2 className="text-4xl font-orbitron font-bold">
              Powerful Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the future of club management with our cutting-edge features
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="bg-card border-border hover:border-primary transition-colors duration-300 animate-float"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-4 rounded-full bg-primary/10">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-orbitron font-bold text-primary">
                ClubLink
              </h3>
              <span className="text-muted-foreground">Connect Beyond Limits</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 ClubLink. Built for the future of student connections.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;