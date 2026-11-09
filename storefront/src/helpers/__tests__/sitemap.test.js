import test from "node:test";
import assert from "node:assert/strict";
import { parseSitemap } from "../sitemap.js";
import { slugToTitle } from "../formatters.js";

const wrap = (...locs) =>
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locs
    .map((l) => `<url><loc>${l}</loc></url>`)
    .join("")}</urlset>`;

test("parses a valid sitemap", () => {
  const pages = parseSitemap(
    wrap("https://shop.example.com/about/", "https://shop.example.com/faq/")
  );
  assert.deepEqual(pages, [
    { slug: "about", title: "About", url: "https://shop.example.com/about/" },
    { slug: "faq", title: "Faq", url: "https://shop.example.com/faq/" },
  ]);
});

test("ignores root and empty or invalid entries", () => {
  const pages = parseSitemap(
    wrap("https://shop.example.com/", "", "not a url", "https://shop.example.com/a/")
  );
  assert.deepEqual(pages.map((p) => p.slug), ["a"]);
});

test("returns [] for empty, undefined or invalid input", () => {
  assert.deepEqual(parseSitemap(""), []);
  assert.deepEqual(parseSitemap(undefined), []);
  assert.deepEqual(parseSitemap({ foo: 1 }), []);
  assert.deepEqual(parseSitemap("<html>nope</html>"), []);
});

test("works with domains other than .com", () => {
  const pages = parseSitemap(
    wrap("https://shop.dev/terms/", "http://localhost:8000/privacy/")
  );
  assert.deepEqual(pages.map((p) => p.slug), ["terms", "privacy"]);
});

test("builds readable titles from slugs with dashes", () => {
  const [page] = parseSitemap(wrap("https://x.com/privacy-policy/"));
  assert.equal(page.slug, "privacy-policy");
  assert.equal(page.title, "Privacy Policy");
  assert.equal(slugToTitle(""), "");
  assert.equal(slugToTitle(undefined), "");
});

test("deduplicates slugs", () => {
  const pages = parseSitemap(
    wrap("https://x.com/about/", "https://x.com/About", "https://x.com/faq/")
  );
  assert.deepEqual(pages.map((p) => p.slug), ["about", "faq"]);
});
