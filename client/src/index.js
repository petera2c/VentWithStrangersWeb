import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { hydrate, render } from "react-dom";

import Routes from "./pages/";
import { GIProvider } from "./context";

import "./theme.css";

const rootElement = document.getElementById("root");

render(
  <GIProvider>
    <Router>
      <Routes />
    </Router>
  </GIProvider>,
  rootElement
);
