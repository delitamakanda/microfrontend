import assert from "node:assert/strict";
import test from "node:test";
import { ROUTES, SOCIAL_LINKS } from "../../constants.js";
import { SHOP_LINKS } from "../footerLinks.js";

test("shop links use the ROUTES values", () => {
  assert.deepEqual(
    SHOP_LINKS.map((l) => l.to),
    [ROUTES.PRODUCTS, ROUTES.CATEGORIES, ROUTES.DEAL]
  );
});

test("social links have a label and an https href", () => {
  assert.ok(SOCIAL_LINKS.length > 0);
  for (const l of SOCIAL_LINKS) {
    assert.ok(l.label.trim());
    assert.ok(l.href.startsWith("https://"));
  }
});
