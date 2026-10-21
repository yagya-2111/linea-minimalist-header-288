import vitalisStore from "@/assets/vitalis-store.jpg";
import vitalisGodown from "@/assets/vitalis-godown.jpg";
import vitalisDoctor from "@/assets/vitalis-doctor.jpg";
import vitalisClinic from "@/assets/vitalis-clinic.jpg";
import vitalisPacking from "@/assets/vitalis-packing.jpg";
import enduraStore from "@/assets/endura-store.jpg";
import enduraGodown from "@/assets/endura-godown.jpg";
import enduraDoctor from "@/assets/endura-doctor.jpg";
import enduraClinic from "@/assets/endura-clinic.jpg";
import enduraPacking from "@/assets/endura-packing.jpg";
import revivaStore from "@/assets/reviva-store.jpg";
import revivaGodown from "@/assets/reviva-godown.jpg";
import revivaDoctor from "@/assets/reviva-doctor.jpg";
import revivaClinic from "@/assets/reviva-clinic.jpg";
import revivaPacking from "@/assets/reviva-packing.jpg";
import trioGodown from "@/assets/trio-godown.jpg";

export interface SanjivaniReview {
  name: string;
  city: string;
  rating: 4 | 5;
  date: string;
  text: string;
  image?: string;
  imageAlt?: string;
}

export const sanjivaniReviewsBySlug: Record<string, SanjivaniReview[]> = {
  "daily-vitality": [
    { name: "Rohit", city: "Delhi", rating: 5, date: "October 2026", text: "The bottle looks exactly as shown. Gold label, sturdy glass dropper, and the seal was intact when it arrived. Very happy with the packaging.", image: vitalisStore, imageAlt: "Vitalis bottle on a medical store shelf" },
    { name: "Arjun", city: "Jaipur", rating: 4, date: "October 2026", text: "Order reached me in three days, well wrapped in bubble wrap. Would like a slightly bigger bottle size option in future.", image: vitalisPacking, imageAlt: "Vitalis bottle being packed for dispatch" },
    { name: "Vivek", city: "Pune", rating: 5, date: "September 2026", text: "Dropper is easy to use and doesn't leak. Label clearly lists the batch number and expiry, which I appreciated before starting.", image: vitalisDoctor, imageAlt: "Vitalis bottle on a doctor's desk" },
    { name: "Karan", city: "Indore", rating: 5, date: "September 2026", text: "Bought it after seeing the clinic display. Quality feels premium for the price and the glass bottle is reuseable.", image: vitalisClinic, imageAlt: "Vitalis bottle at a clinic counter" },
    { name: "Sameer", city: "Kanpur", rating: 4, date: "September 2026", text: "Good value. Delivery update on WhatsApp was quick. Rating four stars only because I wish the box had a usage leaflet inside.", image: vitalisGodown, imageAlt: "Vitalis bottle in the storage godown" },
  ],
  "gut-glow": [
    { name: "Nikhil", city: "Hyderabad", rating: 5, date: "October 2026", text: "Cranberry-toned label looks great and the dropper cap sits tight. Exactly the bottle in the product photos.", image: enduraStore, imageAlt: "Endura bottle on a medical store shelf" },
    { name: "Pranav", city: "Nagpur", rating: 5, date: "October 2026", text: "Second bottle I have ordered. Packing is always careful and the invoice clearly shows the order number.", image: enduraPacking, imageAlt: "Endura bottle being packed for dispatch" },
    { name: "Raghav", city: "Patna", rating: 4, date: "September 2026", text: "Arrived on time. I keep it on my desk and the bottle still looks new after weeks of use. Four stars as I would prefer a larger size.", image: enduraDoctor, imageAlt: "Endura bottle on a doctor's desk" },
    { name: "Devansh", city: "Surat", rating: 5, date: "September 2026", text: "The display at my local wellness counter matched the online pictures, so ordering was an easy decision.", image: enduraClinic, imageAlt: "Endura bottle at a clinic counter" },
    { name: "Manish", city: "Bhopal", rating: 5, date: "September 2026", text: "Sealed properly, batch and manufacturing details printed clearly. Simple, clean product presentation.", image: enduraGodown, imageAlt: "Endura bottle in the storage godown" },
  ],
  "daily-greens": [
    { name: "Anurag", city: "Varanasi", rating: 5, date: "October 2026", text: "Green bottle with the flower label looks lovely in person. Drop counter on the dropper makes measuring simple.", image: revivaStore, imageAlt: "Reviva bottle on a medical store shelf" },
    { name: "Tushar", city: "Nashik", rating: 4, date: "October 2026", text: "Delivered in two days to my area. Box was sealed with tape and a blank label, exactly as the site promises.", image: revivaPacking, imageAlt: "Reviva bottle being packed for dispatch" },
    { name: "Harsh", city: "Agra", rating: 5, date: "September 2026", text: "I ordered after my doctor friend mentioned seeing similar wellness drops at clinics. Packaging did not disappoint.", image: revivaDoctor, imageAlt: "Reviva bottle on a doctor's desk" },
    { name: "Yash", city: "Rajkot", rating: 5, date: "September 2026", text: "Clean display, clear expiry date, and the bottle colour matches the photos. Ordering the trio next time.", image: revivaClinic, imageAlt: "Reviva bottle at a clinic counter" },
    { name: "Divyansh", city: "Meerut", rating: 5, date: "September 2026", text: "Stock always seems available — my second order shipped the same evening. Reliable little store.", image: revivaGodown, imageAlt: "Reviva bottle in the storage godown" },
  ],
  "wellness-trio": [
    { name: "Aditya", city: "Gorakhpur", rating: 5, date: "October 2026", text: "All three bottles arrived together with their own boxes — Vitalis, Endura and Reviva. Great way to try the full range.", image: trioGodown, imageAlt: "The three Sanjivani bottles in the storage godown" },
    { name: "Shubham", city: "Dehradun", rating: 5, date: "October 2026", text: "The trio costs less than buying bottles separately and makes a neat gift box. Presentation is excellent.", text: undefined as never },
    { name: "Mayank", city: "Jodhpur", rating: 4, date: "September 2026", text: "Everything arrived sealed and labelled. Four stars only because I would like a printed guide with the trio box.", image: undefined },
  ],
};
