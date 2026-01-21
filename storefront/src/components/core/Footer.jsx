import { useState, useMemo } from "react";
import { BASE_URL, SITE_TITLE, BLOG_URL, ROUTES } from "../../constants";
import axiosInstance from "../../lib/api";
import { capitalizeFirstLetter } from "../../helpers/formatters";
import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";

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
      <Separator />
      <footer className="grid gap-4 pt-6">
        <div className="grid-auto-flow-row grid-cols-1 gap-2">
          {staticPages.map((item, index) => {
            return (
              <Link
                key={index}
                state={item}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
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
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Blog
          </a>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} {SITE_TITLE}. All rights reserved.
        </p>
      </footer>
    </>
  );
};

// https://ishadeed.com/article/display-contents/
