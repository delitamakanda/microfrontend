/* eslint-disable react/prop-types -- no prop-types dependency in this project */
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { ROUTES } from "../../constants";
import axiosInstance from "../../lib/api";
import { formatPrice } from "../../helpers/formatters";
import { Slider } from "./Slider";
import {
  HERO_TEXT,
  getActiveDeals,
  getResults,
  hasImage,
  hasResponseData,
  getProductImageFallback,
} from "./homeData";

const focusClass =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

// Charge une liste ; `status` : loading | success | error.
// L'intercepteur d'api.js résout `undefined` sur les erreurs non 401.
const useList = (path, select = (items) => items) => {
  const [state, setState] = useState({ status: "loading", items: [] });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", items: [] });
    axiosInstance
      .get(path)
      .then((response) => {
        if (cancelled) return;
        if (!hasResponseData(response)) {
          setState({ status: "error", items: [] });
          return;
        }
        setState({ status: "success", items: select(getResults(response)) });
      })
      .catch(() => {
        if (!cancelled) setState({ status: "error", items: [] });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  return { ...state, retry };
};

const Hero = () => (
  <section
    aria-labelledby="home-hero-title"
    className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white"
  >
    <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-14 sm:py-20">
      <h1
        id="home-hero-title"
        className="text-4xl font-bold tracking-tight sm:text-6xl break-words"
      >
        {HERO_TEXT.title}
      </h1>
      <p className="max-w-xl text-lg text-indigo-50">{HERO_TEXT.tagline}</p>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Link
          to={ROUTES.PRODUCTS}
          className={`inline-flex min-h-[44px] items-center justify-center rounded-md bg-white px-6 py-3 font-semibold text-indigo-900 hover:bg-indigo-50 ${focusClass}`}
        >
          {HERO_TEXT.shopNow}
        </Link>
        <Link
          to={ROUTES.CATEGORIES}
          className={`inline-flex min-h-[44px] items-center justify-center rounded-md border border-white px-6 py-3 font-semibold text-white hover:bg-white/10 ${focusClass}`}
        >
          {HERO_TEXT.browseCategories}
        </Link>
      </div>
    </div>
  </section>
);

const SectionError = ({ onRetry }) => (
  <div role="alert" className="flex flex-col items-center gap-3 py-8">
    <p className="text-gray-900">Unable to load products.</p>
    <Button
      type="button"
      label="Retry"
      onClick={onRetry}
      className="min-h-[44px] rounded-md bg-indigo-700 px-6 py-2 font-semibold text-white hover:bg-indigo-800"
    />
  </div>
);

const SliderSkeleton = ({ height }) => (
  <div aria-hidden="true" className="flex gap-4">
    <Skeleton height={height} className="flex-1 animate-pulse bg-gray-200" />
    <Skeleton height={height} className="hidden flex-1 animate-pulse bg-gray-200 md:block" />
    <Skeleton height={height} className="hidden flex-1 animate-pulse bg-gray-200 md:block" />
  </div>
);

const SlideImage = ({ item, alt, fallbackText, className }) => {
  const [failed, setFailed] = useState(false);
  if (!hasImage(item) || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-indigo-100 p-4 text-center font-medium text-indigo-950 ${className}`}
      >
        {fallbackText}
      </div>
    );
  }
  return (
    <img
      src={item.image_url}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
};

const DealsSection = () => {
  const { status, items, retry } = useList("store/deals/", (deals) =>
    getActiveDeals(deals)
  );

  if (status === "loading") {
    return (
      <section aria-label="Current deals" className="mx-auto max-w-7xl px-6 py-6">
        <Skeleton height="12rem" className="animate-pulse bg-gray-200" />
      </section>
    );
  }
  if (status === "error") {
    return (
      <section aria-label="Current deals" className="mx-auto max-w-7xl px-6">
        <div role="alert" className="flex flex-col items-center gap-3 py-8">
          <p className="text-gray-900">Unable to load deals.</p>
          <Button
            type="button"
            label="Retry"
            onClick={retry}
            className="min-h-[44px] rounded-md bg-indigo-700 px-6 py-2 font-semibold text-white hover:bg-indigo-800"
          />
        </div>
      </section>
    );
  }
  if (items.length === 0) return null;

  return (
    <section aria-label="Current deals" className="mx-auto max-w-7xl px-6 py-6">
      <Slider label="deals" slideClassName="basis-full">
        {items.map((deal) => (
          <Link
            key={deal.uuid ?? deal.slug}
            to={`${ROUTES.DEAL}/${deal.slug}`}
            className={`mx-1 block overflow-hidden rounded-lg bg-indigo-100 text-indigo-950 ${focusClass}`}
          >
            {hasImage(deal) && (
              <SlideImage
                item={deal}
                alt={deal.title}
                fallbackText={deal.title}
                className="h-48 w-full"
              />
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold">{deal.title}</h2>
              <p className="mt-1">{deal.description}</p>
            </div>
          </Link>
        ))}
      </Slider>
    </section>
  );
};

const ProductsSection = () => {
  const { status, items, retry } = useList("store/hot-products/");

  return (
    <section aria-labelledby="latest-products-title" className="mx-auto max-w-7xl px-6 py-6">
      <h2 id="latest-products-title" className="mb-5 text-center text-2xl">
        Latest Products
      </h2>
      {status === "loading" && <SliderSkeleton height="16rem" />}
      {status === "error" && <SectionError onRetry={retry} />}
      {status === "success" && items.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-gray-900">No products yet.</p>
          <Link
            to={ROUTES.CATEGORIES}
            className={`inline-flex min-h-[44px] items-center text-indigo-800 underline ${focusClass}`}
          >
            Browse categories
          </Link>
        </div>
      )}
      {status === "success" && items.length > 0 && (
        <Slider
          label="products"
          slideClassName="basis-full sm:basis-1/2 md:basis-1/3"
        >
          {items.map((product) => (
            <Link
              key={product.uuid}
              to={`${ROUTES.PRODUCTS}/${product.uuid}`}
              className={`mx-2 block rounded-lg ${focusClass}`}
            >
              <SlideImage
                item={product}
                alt={product.name}
                fallbackText={getProductImageFallback(product)}
                className="h-64 w-full rounded-lg"
              />
              <span className="mt-2 block text-gray-900">{product.name}</span>
              {product.price != null && (
                <span className="block font-medium text-gray-900">
                  {formatPrice(product.price)}
                </span>
              )}
            </Link>
          ))}
        </Slider>
      )}
    </section>
  );
};

export const HomePage = () => (
  <>
    <Hero />
    <DealsSection />
    <ProductsSection />
  </>
);
