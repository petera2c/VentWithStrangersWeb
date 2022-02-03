import React from "react";
import { render } from "react-dom";

import Routes from "./pages/";
import "./config/firebase_init";

import "antd/dist/antd.min.css";
import "emoji-mart/css/emoji-mart.css";
import "./theme.css";

const rootElement = document.getElementById("root");

render(<Routes />, rootElement);
