import StorePolicyPage from "@/components/StorePolicyPage";

export default function ShippingPolicy() {
  return <StorePolicyPage title="Shipping Policy" intro="Delivery information for your Sanjivani order, from payment review to arrival." sections={[
    { title: "Delivery details", text: "Confirm your full name, phone number, complete delivery address and postal code before proceeding to payment. If anything needs changing after submission, contact support with your order number before the order is shipped." },
    { title: "Payment review and dispatch", text: "Orders are submitted after UPI or bank transfer with a payment screenshot. Payment must be verified by the store before fulfilment progresses. Submission of a screenshot alone does not confirm payment or dispatch." },
    { title: "Delivery charges", text: "Any delivery charge is displayed in your checkout total before you submit the order. The price of a product or the Wellness Trio does not by itself establish the delivery charge." },
    { title: "Delivery locations and timing", text: "The store has not yet published confirmed serviceable locations, dispatch timeframes or estimated delivery windows. Contact support to confirm delivery availability and timing for your address before making payment. No fixed delivery date is promised here." },
    { title: "Track your order", text: "Sign in to your account to view the Ordered, Packed, Shipped and Delivered stages. These are updated by the store. A tracking number appears when one is supplied; contact support for help if progress is unclear." },
    { title: "Delivery issues", text: "For a missing parcel, incorrect item or damaged delivery, contact support with your order number and relevant photos. Keep the packaging while your request is reviewed. Return and refund requests are covered on the Returns & Refunds page." },
  ]} />;
}