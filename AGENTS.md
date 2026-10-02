# Project Architecture

- The homepage uses a single `SanjivaniLanding` composition so the brand story and live catalogue remain cohesive.
- Product imagery is imported from local generated assets so storefront media does not depend on external image hosts.
- Product details use one slug-driven page and shared catalogue data for product copy and image galleries; database prices and availability are authoritative.
- Authentication and commerce state are shared through `StoreProvider`, while each account, bag, checkout, and admin workflow has its own page.
- Store permissions live in the separate `user_roles` table and are enforced by database row policies and validation triggers; never treat client state as authorization.
- Payment proofs and the store QR image stay in private storage with owner/admin access policies.
- Product reviews must be genuine and verified before being displayed; never create fictional customer statements or ratings.
- Storefront policies describe the active account, order, payment-review, and delivery flows without inventing business contacts, product-label facts, or return terms.
