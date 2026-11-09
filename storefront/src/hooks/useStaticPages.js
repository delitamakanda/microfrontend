import { useEffect, useState } from "react";
import { BASE_URL } from "../constants";
import axiosInstance from "../lib/api";
import { parseSitemap } from "../helpers/sitemap";

let pagesPromise = null;

const fetchStaticPages = () => {
  if (!pagesPromise) {
    pagesPromise = axiosInstance
      .get(`${BASE_URL}sitemap.xml`, {
        responseType: "text",
        headers: { Accept: "application/json" },
      })
      .then((res) => (res?.data ? parseSitemap(res.data) : []))
      .catch(() => [])
      .then((pages) => {
        // do not cache failures or empty results: retry on next mount
        if (!pages.length) pagesPromise = null;
        return pages;
      });
  }
  return pagesPromise;
};

export const useStaticPages = () => {
  const [state, setState] = useState({ pages: [], loading: true });

  useEffect(() => {
    let active = true;
    fetchStaticPages().then((pages) => {
      if (active) setState({ pages, loading: false });
    });
    return () => {
      active = false;
    };
  }, []);

  return state;
};
