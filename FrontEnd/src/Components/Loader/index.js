import React, { Component } from "react";

import "./Styles/";

class Loader extends Component {
	render() {
		return (
			<div className="lds-css ng-scope">
				<div className="lds-wedges">
					<div>
						<div>
							<div />
						</div>
						<div>
							<div />
						</div>
						<div>
							<div />
						</div>
						<div>
							<div />
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Loader;
