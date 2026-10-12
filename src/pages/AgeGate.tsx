import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";

const AgeGate = () => {
  const [denied, setDenied] = useState(false);
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-primary px-6 py-16 text-center text-primary-foreground">
      {denied ? (
        <div className="hero-fade-up flex max-w-md flex-col items-center gap-5">
          <Ban className="h-12 w-12 text-accent" />
          <h1 className="font-display text-4xl font-extrabold sm:text-5xl">Access denied</h1>
          <p className="leading-relaxed text-primary-foreground/75">
            Sanjivani products are intended for adults aged 18 and over. You must be 18 or older to view this store.
          </p>
        </div>
      ) : (
        <div className="hero-fade-up flex max-w-md flex-col items-center gap-5">
          <ShieldCheck className="h-12 w-12 text-accent" />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">Age verification</p>
          <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl">Are you 18 or older?</h1>
          <p className="leading-relaxed text-primary-foreground/75">
            Sanjivani wellness drops are intended for adults. Please confirm your age to continue.
          </p>
          <div className="mt-3 grid w-full grid-cols-2 gap-3">
            <Button
              size="lg"
              className="h-14 rounded-md border-2 border-accent bg-accent text-base font-bold text-primary hover:bg-accent hover:text-primary focus-visible:text-primary"
              onClick={() => navigate("/products/daily-vitality")}
            >
              Yes, I am 18+
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 rounded-md border-2 border-primary-foreground/60 bg-transparent text-base font-bold text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={() => setDenied(true)}
            >
              No
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};

export default AgeGate;
