import { combineReducers } from "redux";

function activePage(state = "", action) {
	switch (action.type) {
		case "TAB_SELECTED":
			return action.payload;
		default:
			return state;
	}
}
function activeUser(state = null, action) {
	switch (action.type) {
		case "USER_SELECTED":
			return action.payload;
		default:
			return state;
	}
}

const rootReducer = combineReducers({
	activePage: activePage,
	activeUser: activeUser
});

export default rootReducer;
