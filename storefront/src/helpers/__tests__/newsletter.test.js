import assert from "node:assert/strict";
import test from "node:test";
import { newsletterSchema, validateNewsletterEmail } from "../newsletter.js";

test("invalid emails are rejected", () => {
  for (const e of ["", "   ", "foo", "foo bar@x.com", "a@"]) {
    assert.notEqual(validateNewsletterEmail(e), true, e);
  }
});

test("valid email is accepted, trimmed", () => {
  assert.equal(validateNewsletterEmail("  a@b.co "), true);
  assert.equal(newsletterSchema.cast({ email: " a@b.co " }).email, "a@b.co");
});
