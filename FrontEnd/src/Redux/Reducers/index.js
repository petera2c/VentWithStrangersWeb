import { combineReducers } from "redux";

function activePage(state = "", action) {
	switch (action.type) {
		case "TAB_SELECTED":
			return action.payload;
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	activePage: activePage
});

export default rootReducer;
