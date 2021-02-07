import React from "react";
import ReactDOM from "react-dom";
import { hydrate, render } from "react-dom";
import firebase from "firebase/app";
import "firebase/analytics";

import firebaseConfig from "./config/firebase";

import Routes from "./pages/";

import "./theme.css";

firebase.initializeApp(firebaseConfig);
if (location.hostname !== "localhost") firebase.analytics();
const rootElement = document.getElementById("root");

render(<Routes />, rootElement);
