import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";

/**
 * Basic test to verify CI/CD setup is working correctly
 */
Deno.test("CI/CD - Basic test suite verification", () => {
  assertEquals(1 + 1, 2);
});

Deno.test("CI/CD - Environment access", () => {
  // Test that we can access environment variables (--allow-env)
  const nodeEnv = Deno.env.get("CI") || "development";
  assertEquals(typeof nodeEnv, "string");
});

Deno.test("CI/CD - Network access", async () => {
  // Test that we have network access (--allow-net)
  // This is a basic connectivity test
  const response = await fetch("https://deno.land");
  assertEquals(response.ok, true);
});
