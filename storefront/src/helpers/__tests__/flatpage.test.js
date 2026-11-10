import assert from "node:assert/strict";
import test from "node:test";
import { resolveFlatPage } from "../flatpage.js";

const pages = [
  { slug: "about", title: "About", url: "https://x.test/about/" },
  { slug: "faq", title: "Faq", url: "https://x.test/faq/" },
];

test("state with a url takes priority", () => {
  const state = { slug: "about", title: "State", url: "https://s.test/a/" };
  assert.deepEqual(resolveFlatPage({ state, pages, slug: "about" }), {
    slug: "about",
    title: "State",
    url: "https://s.test/a/",
  });
});

test("falls back to the pages list without state", () => {
  assert.equal(resolveFlatPage({ pages, slug: "faq" }).url, "https://x.test/faq/");
});

test("unknown slug returns null", () => {
  assert.equal(resolveFlatPage({ pages, slug: "nope" }), null);
});

test("state of another page is ignored", () => {
  const state = { slug: "about", title: "About", url: "https://x.test/about/" };
  assert.equal(resolveFlatPage({ state, pages, slug: "faq" }).url, "https://x.test/faq/");
  assert.equal(resolveFlatPage({ state, pages: [], slug: "faq" }), null);
});

test("empty or missing pages", () => {
  assert.equal(resolveFlatPage({ pages: [], slug: "about" }), null);
  assert.equal(resolveFlatPage({ slug: "about" }), null);
});
