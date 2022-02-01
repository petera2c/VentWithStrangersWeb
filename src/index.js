import React from "react";
import { render } from "react-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/analytics";
import Routes from "./pages/";

import "./config/firebase";

import "antd/dist/antd.min.css";
import "./theme.css";

if (window.location.hostname !== "localhost") firebase.analytics();
const rootElement = document.getElementById("root");

render(<Routes />, rootElement);
