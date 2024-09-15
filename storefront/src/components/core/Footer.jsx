import { Divider } from "primereact/divider";
import { useState, useMemo } from "react";
import { BASE_URL, SITE_TITLE, BLOG_URL, ROUTES } from "../../constants";
import axiosInstance from "../../lib/api";
import { capitalizeFirstLetter } from "../../helpers/formatters";
import { Link } from "react-router-dom";

const parseXml = (html) => {
  const parser = new DOMParser();
  return parser.parseFromString(html, "text/xml");
};

export const Footer = () => {
  const [staticPages, setStaticPages] = useState([]);

  useMemo(() => {
    axiosInstance
      .get(`${BASE_URL}sitemap.xml`, {
        responseType: "text",
        headers: {
          Accept: "application/json",
        },
      })
      .then((res) => {
        const xml = parseXml(res.data).querySelectorAll("loc");
        setStaticPages(
          Array.from(xml).map((item) => {
            return {
              slug: item.textContent
                .split(".com/")[1]
                .replace(/\//g, "")
                .toLowerCase(),
              title: capitalizeFirstLetter(
                item.textContent.split(".com/")[1].replace(/\//g, "")
              ),
              url: item.textContent,
            };
          })
        );
      });
  }, []);

  return (
    <>
      <Divider />
      <footer className="grid">
        <div className="grid-auto-flow-row grid-cols-1 gap-2">
          {staticPages.map((item, index) => {
            return (
              <Link
                key={index}
                state={item}
                className="mr-4"
                to={`${ROUTES.FLATPAGE}/${item.slug}`}
              >
                {item.title}
              </Link>
            );
          })}
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-900 dark:text-gray-100"
          >
            Blog
          </a>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} {SITE_TITLE}. All rights reserved.
        </p>
      </footer>
    </>
  );
};

// https://ishadeed.com/article/display-contents/
