import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import axiosInstance from "../../lib/api";
import "./homepage.css";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

export const HomePage = () => {
  const [lastProducts, setLastProducts] = useState([]);
  const [lastNews, setLastNews] = useState([]);
  const [productCarouselRef] = useEmblaCarousel(
    { dragFree: false, loop: true },
    [Autoplay()]
  );
  const [dealCarouselRef] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  useEffect(() => {
    axiosInstance
      .get("store/hot-products/")
      .then((response) => {
        if (response.data) {
          setLastProducts(response.data.results);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    axiosInstance.get("store/deals/").then((response) => {
      if (response.data) {
        setLastNews(
          response.data.results.filter(
            (deal) =>
              new Date(deal.start_date) <= new Date() &&
              new Date() <= new Date(deal.end_date)
          )
        );
      }
    });
  }, []);

  return (
    <>
      {lastNews && lastNews.length >= 1 && (
        <div className="overflow-hidden rounded-lg border bg-card" ref={dealCarouselRef}>
          <div className="flex">
            {lastNews.map((news) => (
              <div
                key={news.slug}
                className="min-w-0 flex-[0_0_100%] p-6"
              >
                <img
                  src={news.image_url}
                  alt={news.title}
                  className="h-64 w-full rounded-lg object-cover"
                />
                <Link to={`${ROUTES.DEAL}/${news.slug}`}>
                  <h2 className="mt-4 text-xl font-semibold text-foreground">
                    {news.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {news.description}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
      <h2 className="text-center text-2xl mt-5 mb-5">Latest Products</h2>
      <div className="carousel overflow-hidden" ref={productCarouselRef}>
        <div className="carousel-container flex">
          {lastProducts &&
            lastProducts.map((product) => (
              <div
                key={product.uuid}
                className="carousel-slide min-w-0 flex-grow-0 flex-shrink-0 basis-4/12"
              >
                <Link to={`${ROUTES.PRODUCTS}/${product.uuid}`}>
                  <img
                    src={product.image_url}
                    width="300"
                    height="100%"
                    alt={product.name}
                    className="rounded-lg"
                  />
                </Link>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
