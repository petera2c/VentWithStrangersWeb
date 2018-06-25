import React, { Component } from "react";

import "./Styles/";

class SmallLoader extends Component {
	render() {
		return (
			<div className="lds-ripple">
				<div />
				<div />
			</div>
		);
	}
}

export default SmallLoader;
