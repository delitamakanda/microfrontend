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
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/posts',
        element: <Posts />,
      },
      {
        path: '/posts/:permalink',
        element: <Post />
      },
      {
        path: '/authors',
        element: <Authors />,
      },
      {
        path: '/authors/:permalink',
        element: <Author />,
      }
    ]
  },
]);

const root = createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
  <RouterProvider router={router} />
  </React.StrictMode>
);
