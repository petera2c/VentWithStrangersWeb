import React from "react";
import ReactDOM from "react-dom";
import { hydrate, render } from "react-dom";
import firebase from "firebase/app";
import "firebase/analytics";
import "antd/dist/antd.css";

import Routes from "./pages/";

import "./config/firebase";

import "./theme.css";

if (location.hostname !== "localhost") firebase.analytics();
const rootElement = document.getElementById("root");

render(<Routes />, rootElement);
