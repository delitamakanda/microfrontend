import { slugToTitle } from "./formatters.js";

const LOC_REGEX = /<loc>\s*([^<]*?)\s*<\/loc>/gi;

const decodeEntities = (value) =>
  value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");

/**
 * Extracts the static pages from a sitemap.xml text (no DOM needed).
 * Returns [{ slug, title, url }]; the site root, empty or invalid entries
 * and duplicate slugs are ignored.
 */
export const parseSitemap = (xml) => {
  if (typeof xml !== "string" || !xml) return [];

  const pages = [];
  const seen = new Set();

  for (const match of xml.matchAll(LOC_REGEX)) {
    const url = decodeEntities(match[1]);
    let pathname;
    try {
      pathname = new URL(url).pathname;
    } catch {
      continue;
    }
    const slug = pathname.split("/").filter(Boolean).join("-").toLowerCase();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    pages.push({ slug, title: slugToTitle(slug), url });
  }

  return pages;
};
