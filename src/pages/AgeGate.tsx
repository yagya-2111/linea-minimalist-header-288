import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
          <p className="mt-2 max-w-sm text-sm text-primary-foreground/60">
            Close this page or re-open sanjivani.shop to try again.
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
          <div className="mt-3 flex w-full flex-col gap-3">
            <Button
              size="lg"
              className="h-14 w-full rounded-sm text-base font-bold"
              onClick={() => navigate("/products/daily-vitality")}
            >
              Yes, I am 18 or older
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 w-full rounded-sm border-primary-foreground/40 bg-transparent text-base font-bold text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              onClick={() => setDenied(true)}
            >
              No, I am under 18
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};

export default AgeGate;
