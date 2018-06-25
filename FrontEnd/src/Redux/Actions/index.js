export const changePage = activePage => {
	return {
		type: "TAB_SELECTED",
		payload: activePage
	};
};

export const setUser = user => {
	return {
		type: "USER_SELECTED",
		payload: user
	};
};
