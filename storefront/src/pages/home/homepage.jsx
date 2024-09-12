import { Image } from "primereact/image";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import axiosInstance from "../../lib/api";
import "./homepage.css";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "primereact/carousel";

export const HomePage = () => {
  const [lastProducts, setLastProducts] = useState([]);
  const [lastNews, setLastNews] = useState([]);
  const [carouselRef] = useEmblaCarousel({ dragFree: false, loop: true }, [
    Autoplay(),
  ]);

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

  const offerTemplate = (news) => {
    return (
      <div className="py-5 px-3">
        <Image
          src={news.image_url}
          width="100%"
          height="100%"
          alt={news.title}
          style={{ backgroundColor: "#33ccee" }}
        />
        <Link to={`${ROUTES.DEAL}/${news.slug}`}>
          <h2>{news.title}</h2>
          <h2>{news.description}</h2>
        </Link>
      </div>
    );
  };

  return (
    <>
      {lastNews && (
        <Carousel
          value={lastNews}
          numScroll={1}
          numVisible={1}
          showNavigators={true}
          showIndicators={false}
          itemTemplate={offerTemplate}
        />
      )}
      <h2 className="text-center text-2xl mt-5 mb-5">Latest Products</h2>
      <div className="carousel overflow-hidden" ref={carouselRef}>
        <div className="carousel-container flex">
          {lastProducts &&
            lastProducts.map((product) => (
              <div
                key={product.uuid}
                className="carousel-slide min-w-0 flex-grow-0 flex-shrink-0 basis-4/12"
              >
                <Link to={`${ROUTES.PRODUCTS}/${product.uuid}`}>
                  <Image
                    src={product.image_url}
                    width="300"
                    height="100%"
                    alt={product.name}
                  />
                </Link>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
