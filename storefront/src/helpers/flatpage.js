import { slugToTitle } from "./formatters.js";

/**
 * Finds the static page to display. `location.state` is only an optimisation
 * (immediate display): it is ignored when it targets another slug.
 * Returns { slug, title, url } or null.
 */
export const resolveFlatPage = ({ state, pages, slug }) => {
  if (state?.url && (!state.slug || state.slug === slug)) {
    return {
      slug,
      title: state.title || slugToTitle(slug),
      url: state.url,
    };
  }
  const found = (pages ?? []).find((p) => p.slug === slug);
  if (!found) return null;
  return { ...found, title: found.title || slugToTitle(slug) };
};
