import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { storeContact } from "@/lib/storeContact";

const WhatsAppIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-7 w-7"><path d="M20.52 3.48A11.91 11.91 0 0 0 12.04 0C5.45 0 .09 5.36.09 11.95c0 2.11.55 4.17 1.6 5.99L0 24l6.23-1.63a11.94 11.94 0 0 0 5.81 1.48h.01C18.63 23.85 24 18.49 24 11.9c0-3.19-1.24-6.19-3.48-8.42ZM12.04 21.83a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.7.97.99-3.61-.24-.37a9.88 9.88 0 0 1-1.52-5.28c0-5.47 4.45-9.92 9.93-9.92a9.84 9.84 0 0 1 7.02 2.91 9.85 9.85 0 0 1 2.9 7.02c0 5.48-4.45 9.93-9.98 9.87Zm5.45-7.43c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.78-1.66-2.08-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.88 1.22 3.08c.15.2 2.1 3.21 5.08 4.5.71.31 1.27.49 1.7.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" /></svg>;

const SupportDock = () => (
  <aside aria-label="Customer support" className="fixed bottom-[calc(6.75rem+env(safe-area-inset-bottom))] right-3 z-50 flex flex-col items-end gap-2 md:bottom-6 md:right-6">
    <div className="flex flex-col gap-3">
      <Button asChild size="icon" className="h-14 w-14 rounded-full bg-support-call text-support-foreground shadow-lg hover:bg-support-call/90 sm:h-16 sm:w-16" title={`Call ${storeContact.display}`}>
        <a href={storeContact.phoneHref} aria-label={`Call customer support on ${storeContact.display}`}><Phone className="h-6 w-6" /></a>
      </Button>
      <Popover>
        <PopoverTrigger asChild><Button size="icon" className="h-14 w-14 rounded-full bg-support text-support-foreground shadow-lg hover:bg-support/90 sm:h-16 sm:w-16" title="WhatsApp customer support" aria-label="Open WhatsApp support"><WhatsAppIcon /></Button></PopoverTrigger>
        <PopoverContent side="left" align="end" sideOffset={12} className="w-64 max-w-[calc(100vw-6rem)]">
          <p className="font-display text-lg font-bold">Sanjivani support</p>
          <p className="mt-2 text-sm text-muted-foreground">Questions about a serum, payment or your order?</p>
          <p className="mt-3 text-sm font-bold">{storeContact.display}</p>
          <Button asChild className="mt-4 w-full bg-support text-support-foreground hover:bg-support/90"><a href={storeContact.whatsappHref} target="_blank" rel="noreferrer">Chat on WhatsApp</a></Button>
        </PopoverContent>
      </Popover>
    </div>
  </aside>
);

export default SupportDock;