import React from "react";
import ReactDOM from "react-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reducers from "./Redux/Reducers/";

import MainPage from "./Pages/MainPage";
import "./Css/";
require("../public/favicon.ico");

function logger({ getState }) {
	return next => action => {
		const returnValue = next(action);
		return returnValue;
	};
}
const store = createStore(reducers, applyMiddleware(logger));

ReactDOM.render(
	<Provider store={store}>
		<MainPage />
	</Provider>,
	document.getElementById("root")
);
