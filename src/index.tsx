import { render } from "react-dom";
import AppRoutes from "./pages/Routes";

import "./config/firebase_init";
import "./config/db_init";

import "./theme.css";
import { getApps } from "firebase/app";

const rootElement = document.getElementById("root");

render(<AppRoutes />, rootElement);
