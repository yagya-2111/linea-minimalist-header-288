# Project Architecture

- The homepage uses a single `SanjivaniLanding` composition so the brand story and live catalogue remain cohesive.
- Product imagery is imported from local generated assets so storefront media does not depend on external image hosts.
- Interactive bottle previews use label textures cropped from the original generated product artwork and are paired with the full product photographs, preserving each bottle’s identity without remote model dependencies.
- Keep mobile purchase actions in one route-aware bar so product, bag, and checkout pages offer the right action without duplicating commerce logic.
- Product details use one slug-driven page and shared catalogue data for product copy and image galleries; database prices and availability are authoritative.
- Authentication and commerce state are shared through `StoreProvider`; persist each customer's bag under their authenticated user ID and scope customer order/profile reads to that ID, while admins may review all orders.
- Direct-buy checkout passes a catalogue slug and orders a single validated active product without mutating the saved bag; this keeps immediate purchases separate from a customer's ongoing bag.
- Store permissions live in the separate `user_roles` table and are enforced by database row policies and validation triggers; never treat client state as authorization.
- Payment proofs and the store QR image stay in private storage with owner/admin access policies.
- Product reviews must be genuine and verified before being displayed; never create fictional customer statements or ratings.
- Storefront policies describe the active account, order, payment-review, and delivery flows without inventing business contacts, product-label facts, or return terms.
- Global customer support actions live in one fixed dock and use the verified store phone number so contact details stay consistent across routes.
- Contact destinations are defined once in `storeContact` and reused in checkout, footer and support dock to prevent inconsistent updates.
- Section navigation is handled centrally on pathname, hash and history-key changes, including same-page links and delayed section rendering.
