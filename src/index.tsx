import { render } from "react-dom";
import AppRoutes from "./pages/Routes";

import "./config/firebase_init";

import "./theme.css";

const rootElement = document.getElementById("root");

render(<AppRoutes />, rootElement);
