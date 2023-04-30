import React from "react";
import { createRoot } from 'react-dom/client';

import "./index.scss";
import ButtonModule from 'storefrontApp/Button'
const Button = ButtonModule.default
import useStore from 'storefrontApp/store'

const App = () => (
  <div className="mt-10 text-3xl mx-auto max-w-6xl">
    <div>Name: blog</div>
    <div>Framework: react</div>
    <div>Language: JavaScript</div>
    <div>CSS: Tailwind</div>
    <Button />
  </div>
);

const root = createRoot(document.getElementById('app'));
root.render(<App />);
