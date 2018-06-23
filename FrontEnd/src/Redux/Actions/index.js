export const changePage = activePage => {
	return {
		type: "TAB_SELECTED",
		payload: activePage
	};
};
