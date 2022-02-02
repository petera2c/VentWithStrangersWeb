import React from "react";
import { render } from "react-dom";
import loadable from "@loadable/component";

import Routes from "./pages/";

import "./config/firebase_init";

import "antd/dist/antd.min.css";
import "./theme.css";

if (window.location.hostname === "localhost") {
  loadable(() => import("./config/db_init"));
}

const rootElement = document.getElementById("root");

render(<Routes />, rootElement);
