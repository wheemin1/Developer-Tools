import { decodeJwt, decodeProtectedHeader, jwtVerify, SignJWT } from "jose";

const GOLDEN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
const GOLDEN_SECRET = "your-256-bit-secret";

const tests = [];

function test(name, fn) {
  tests.push({ name, fn });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

test("Decode header/payload from golden token", async () => {
  const header = decodeProtectedHeader(GOLDEN_TOKEN);
  const payload = decodeJwt(GOLDEN_TOKEN);
  assert(header.alg === "HS256", "Expected alg HS256");
  assert(header.typ === "JWT", "Expected typ JWT");
  assert(payload.sub === "1234567890", "Expected sub claim");
  assert(payload.name === "John Doe", "Expected name claim");
});

test("Verify golden token with correct secret", async () => {
  const secretKey = new TextEncoder().encode(GOLDEN_SECRET);
  await jwtVerify(GOLDEN_TOKEN, secretKey);
});

test("Fail verification with wrong secret", async () => {
  const secretKey = new TextEncoder().encode("wrong-secret");
  let failed = false;
  try {
    await jwtVerify(GOLDEN_TOKEN, secretKey);
  } catch {
    failed = true;
  }
  assert(failed, "Verification should fail with wrong secret");
});

for (const alg of ["HS256", "HS384", "HS512"]) {
  test(`Encode token with ${alg}`, async () => {
    const secretKey = new TextEncoder().encode("smoke-test-secret");
    const token = await new SignJWT({ sub: "qa-user", role: "tester" })
      .setProtectedHeader({ alg, typ: "JWT" })
      .sign(secretKey);
    assert(typeof token === "string" && token.split(".").length === 3, "Expected valid JWT format");

    const decodedHeader = decodeProtectedHeader(token);
    assert(decodedHeader.alg === alg, `Expected alg ${alg}`);
  });
}

test("Reject unsupported algorithm branch logic", async () => {
  const header = { alg: "RS256", typ: "JWT" };
  const isSupported = typeof header.alg === "string" && header.alg.startsWith("HS");
  assert(!isSupported, "RS256 must be treated as unsupported in current component logic");
});

test("Generate Base64 secret format", async () => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  const secret = btoa(binary);
  assert(secret.length > 0, "Generated secret should be non-empty");
  assert(/^[A-Za-z0-9+/]+=*$/.test(secret), "Generated secret should be Base64-looking");
});

let passed = 0;
let failed = 0;

for (const t of tests) {
  try {
    await t.fn();
    passed += 1;
    console.log(`PASS - ${t.name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL - ${t.name}`);
    console.error(`  ${error instanceof Error ? error.message : String(error)}`);
  }
}

console.log("\nSummary");
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

if (failed > 0) {
  process.exitCode = 1;
}
