# UI/UX Upgrade Notes

## Implemented
- Added SEO landing pages for high-intent JWT and Base64 QR queries.
- Added Base64 JWT secret key generator to the JWT encoder.
- Added internal links for SEO landing pages from home and tool views.
- Updated sitemap with all tool and SEO landing routes.

## Recommended Next
1. Add a short FAQ to JWT and QR landing pages for long-tail queries.
2. Add Open Graph images per landing page for higher CTR.
3. Add lightweight analytics events for encode/decode actions.
4. Consider a dedicated JWT secret tool page once behavior stabilizes.

## Potential Bugs to Watch
- JWT secret generation uses `crypto.getRandomValues` and assumes browser support.
- Base64 output uses `btoa`; non-ASCII secrets are not expected, but should be tested.
- URL encode tool auto-detect mode can flip on ambiguous inputs.
