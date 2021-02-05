import React from "react";
import ReactDOM from "react-dom";
import { hydrate, render } from "react-dom";
import firebase from "firebase/app";
import "firebase/analytics";

import { firebaseConfig } from "./config/firebase";

import Routes from "./pages/";

import "./theme.css";

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const rootElement = document.getElementById("root");

var db = firebase.database();
if (location.hostname === "localhost") {
  // Point to the RTDB emulator running on localhost.
  db.useEmulator("localhost", 9000);
}

render(<Routes />, rootElement);
