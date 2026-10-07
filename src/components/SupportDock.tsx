import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const SUPPORT_NUMBER = "9131338236";
const SUPPORT_NUMBER_E164 = "919131338236";

const SupportDock = () => (
  <aside aria-label="Customer support" className="fixed bottom-[calc(6.75rem+env(safe-area-inset-bottom))] right-3 z-50 flex flex-col items-end gap-2 md:bottom-6 md:right-6">
    <div className="hidden border border-border bg-background px-4 py-3 shadow-lg md:block">
      <p className="text-xs font-bold uppercase text-accent-strong">Customer support</p>
      <p className="mt-1 font-display text-sm font-extrabold">Call or WhatsApp {SUPPORT_NUMBER}</p>
    </div>
    <div className="flex gap-2">
      <Button asChild size="icon" variant="outline" className="h-12 w-12 rounded-full border-primary bg-background shadow-lg" title="Call customer support">
        <a href={`tel:+91${SUPPORT_NUMBER}`} aria-label={`Call customer support on ${SUPPORT_NUMBER}`}><Phone className="h-5 w-5" /></a>
      </Button>
      <Button asChild size="icon" className="h-12 w-12 rounded-full bg-support text-support-foreground shadow-lg hover:bg-support/90" title="Chat on WhatsApp">
        <a href={`https://wa.me/${SUPPORT_NUMBER_E164}`} target="_blank" rel="noreferrer" aria-label={`Chat with customer support on WhatsApp at ${SUPPORT_NUMBER}`}><MessageCircle className="h-5 w-5" /></a>
      </Button>
    </div>
  </aside>
);

export default SupportDock;