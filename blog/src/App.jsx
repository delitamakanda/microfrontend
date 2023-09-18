import React from "react";
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import "./index.scss";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import Posts from "./routes/posts";
import Post from "./routes/post";
import Authors from "./routes/authors";
import Author from "./routes/author";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: '/posts',
    element: <Root><Posts /></Root>,
  },
  {
    path: '/posts/:permalink',
    element: <Root><Post /></Root>
  },
  {
    path: '/authors',
    element: <Root><Authors /></Root>,
  },
  {
    path: '/authors/:permalink',
    element: <Root><Author /></Root>,
  }
]);

const root = createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
  <RouterProvider router={router} />
  </React.StrictMode>
);
