# JWT Encoder & Decoder - Deep QA Guide

## Scope
- Component: components/tools/jwt-decoder.tsx
- Related component: components/tools/jwt-secret-key-generator.tsx
- Objective: Validate correctness, resilience, trust signaling, and UX stability for JWT-heavy traffic.

## Test Environments
- Desktop: Chrome latest, Firefox latest, Edge latest
- Mobile: iOS Safari latest, Android Chrome latest
- Screen widths: 390px, 768px, 1280px

## Severity Model
- Critical: Security/trust break, incorrect token generation/verification, crash
- Major: Wrong state, misleading result, significant UX failure
- Minor: Visual/wording inconsistency, non-blocking feedback issues

## Functional Test Matrix

### Decode & Verify
1. Input valid HS256 sample token and verify header/payload fields.
2. Enter correct secret and verify status = Signature Verified.
3. Enter wrong secret and verify status = Invalid Signature.
4. Clear secret and verify status resets to neutral (none).
5. Use Load Sample Token and verify token + secret fields are populated.

### Encode
1. Default header/payload/secret should generate a token.
2. Change payload claim and verify token changes.
3. Change algorithm to HS384 and HS512 and verify token still generates.
4. Copy token and confirm clipboard content equals output token.

### Secret Generator In-Tool
1. Click Generate in JWT Secret Key Generator area.
2. Verify secret appears and is non-empty Base64 string.
3. Verify generated secret is copied into Sign with Secret input.
4. Copy generated secret and validate clipboard content.

## Negative & Robustness Cases

### Decode Errors
1. Token with only 2 segments -> Invalid JWT Format error shown.
2. Token with invalid Base64 segment -> Invalid JWT Format error shown.
3. Whitespace-only token -> decoded output and status cleared.

### Encode Errors
1. Header JSON invalid syntax -> Encoding Error alert shown.
2. Payload JSON invalid syntax -> Encoding Error alert shown.
3. Unsupported alg (RS256 in header JSON) -> "Algorithm not supported" message shown.

### Boundary Cases
1. Very long payload (5k+ chars) does not freeze UI.
2. Rapidly changing secret does not leave stale verify state visible.
3. Switching tabs repeatedly preserves expected state without crashes.

## Security & Trust Checks
1. Confirm all operations are client-side in browser (no network dependency for encode/decode).
2. Confirm decoded token is not implicitly treated as verified until secret check passes.
3. Confirm non-HS token with secret does not display false positive verification.

## UX Checks
1. Copy feedback appears for token copy action.
2. Error messages are visible near the relevant action panel.
3. Mobile layout keeps input/output readable and controls tappable.
4. Placeholder and labels remain understandable for first-time users.

## Known Risks to Track
1. Race condition risk in async verifyToken during very fast typing.
2. Single copied flag currently shared across token/secret copy actions.
3. Unsupported algorithms mapped to generic invalid state may confuse users.

## Regression Set (Run After Any JWT Change)
1. 3.1 Decode sample token
2. 3.2 Verify correct secret
3. 3.3 Encode with default payload
4. Invalid payload JSON error case
5. Secret generation + copy case
6. Mobile viewport smoke check

## Exit Criteria
- 0 Critical open
- 0 Major open for core encode/decode/verify flows
- Minor issues documented with owner and follow-up milestone
