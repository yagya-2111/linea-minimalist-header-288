import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto flex min-h-[55vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent-strong">Sanjivani catalogue</p>
        <h1 className="mt-4 font-display text-5xl font-extrabold">We couldn’t find that page.</h1>
        <p className="mt-4 max-w-lg text-muted-foreground">That page may have moved, or the blend you’re looking for isn’t in the collection.</p>
        <Button asChild className="mt-8 rounded-sm font-bold"><Link to="/"><ArrowLeft /> Back to Sanjivani</Link></Button>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;