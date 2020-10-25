import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { hydrate, render } from "react-dom";
import firebase from "firebase/app";
import "firebase/analytics";

import { firebaseConfig } from "./config/firebase";

import Routes from "./pages/";
import { GIProvider } from "./context";

import "./theme.css";

firebase.initializeApp(firebaseConfig);
firebase.analytics();

const rootElement = document.getElementById("root");

render(
  <GIProvider>
    <Router>
      <Routes />
    </Router>
  </GIProvider>,
  rootElement
);
