import StorePolicyPage from "@/components/StorePolicyPage";

export default function ReturnPolicy() {
  return <StorePolicyPage title="Returns & Refunds" intro="Contact Sanjivani about cancellations, damaged deliveries, returns or payment concerns." sections={[
    { title: "Before you purchase", text: "The store has not yet confirmed a return window, cancellation cutoff, eligibility conditions, return charges or refund processing timeframe. Ask support for these terms before making payment. This page does not promise a money-back guarantee or restrict rights provided by applicable law." },
    { title: "Request a cancellation", text: "Contact support with your order number and explain your request. The store will review the current payment and fulfilment stage and tell you whether cancellation is possible. Sending a request does not automatically cancel an order." },
    { title: "Damaged, incorrect or missing items", text: "Share your order number, a description of the issue and clear photos of the parcel, product and any damage. Keep the product and packaging while support reviews the issue. Do not use a product that appears damaged or tampered with." },
    { title: "Return requests", text: "Contact support before sending any product back. Ask for confirmation of eligibility, the return address, shipping responsibility and next steps. Product safety and condition may affect the review; no unconfirmed blanket no-return rule is imposed here." },
    { title: "Refunds and payment review", text: "A payment rejection or a cancelled order is not an automatic refund. If you have transferred money, share the transaction reference through the official support channel so the store can investigate. Any approved refund amount, method and timeline must be confirmed by support." },
    { title: "Wellness Trio", text: "For a request concerning the three-drop combo, state which bottle or bottles are affected and include photos of the complete set where relevant. Support must confirm whether a partial return or refund is available." },
    { title: "Your consumer rights", text: "Nothing on this page excludes rights or remedies available under applicable consumer law. Keep your order details and payment receipt for any support request." },
  ]} />;
}