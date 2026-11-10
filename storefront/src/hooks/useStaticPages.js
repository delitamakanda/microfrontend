import { useCallback, useEffect, useState } from "react";
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
      .then((res) => ({
        pages: res?.data ? parseSitemap(res.data) : [],
        error: !res?.data,
      }))
      .catch(() => ({ pages: [], error: true }))
      .then((result) => {
        // do not cache failures or empty results: retry on next mount
        if (!result.pages.length) pagesPromise = null;
        return result;
      });
  }
  return pagesPromise;
};

export const useStaticPages = () => {
  const [state, setState] = useState({ pages: [], loading: true, error: false });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    fetchStaticPages().then(({ pages, error }) => {
      if (active) setState({ pages, loading: false, error: error && !pages.length });
    });
    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState((s) => ({ ...s, loading: true, error: false }));
    setAttempt((n) => n + 1);
  }, []);

  return { ...state, retry };
};
