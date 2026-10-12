import StorePolicyPage from "@/components/StorePolicyPage";

export default function ReturnPolicy() {
  return <StorePolicyPage title="Returns & Refunds" intro="How cancellations, returns and refunds work for your Sanjivani order." sections={[
    { title: "7-day return window", text: "You may request a return within 7 days of your order being delivered. Contact support with your order number within those 7 days so the request can be reviewed before the window closes." },
    { title: "Cancellation until delivery", text: "An order can be cancelled at any time until it has been delivered. Contact support with your order number to request cancellation; the store will confirm the cancellation and its refund based on the current order stage." },
    { title: "Refunds to your original payment mode", text: "Approved refunds are processed within 2 working days to the original mode of payment used for the order. Keep your payment receipt and transaction reference so the refund can be matched to your payment." },
    { title: "Damaged, incorrect or missing items", text: "Share your order number, a description of the issue and clear photos of the parcel, product and any damage. Keep the product and packaging while support reviews the issue. Do not use a product that appears damaged or tampered with." },
    { title: "Return requests", text: "Contact support before sending any product back. Support will confirm the return address, shipping responsibility and next steps for your request. Product safety and condition may affect the review of a return." },
    { title: "Wellness Trio", text: "For a request concerning the three-drop combo, state which bottle or bottles are affected and include photos of the complete set where relevant. Support will confirm whether a partial return or refund applies." },
    { title: "Your consumer rights", text: "Nothing on this page excludes rights or remedies available under applicable consumer law. Keep your order details and payment receipt for any support request." },
  ]} />;
}