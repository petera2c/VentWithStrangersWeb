import React, { Component } from "react";
import axios from "axios";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setUser } from "../../Redux/Actions/";

import Chat from "../../Components/Chat/";
import Loader from "../../Components/Loader/";
import "./Styles/";

class MainPage extends Component {
	state = {
		saving: true,
		listener: false,
		venter: false,
		user: this.props.user,
		conversation: undefined
	};
	componentDidMount() {
		axios.get("/api/user").then(res => {
			let { success, user, message } = res.data;

			if (success) {
				this.props.setUser(user);
				this.setState({ saving: false, user: user });
			} else {
				alert(message);
			}
		});
		this.findConversation();
	}
	becomeListener = () => {
		this.setState({ saving: true, listener: true, venter: false, conversation: undefined });
		axios.post("/api/user", { userChangesArray: [{ index: "type", value: "listener" }] }).then(res => {
			const { user } = res.data;
			this.props.setUser(user);
			this.setState({ user: user });
			axios.get("/api/listener").then(res => {
				this.setState({ saving: false, conversation: undefined });
				this.findConversation();
			});
		});
	};
	becomeVenter = () => {
		this.setState({ saving: true, listener: false, venter: true, conversation: undefined });
		axios.post("/api/user", { userChangesArray: [{ index: "type", value: "venter" }] }).then(res => {
			const { user } = res.data;
			this.props.setUser(user);
			this.setState({ user: user });
			axios.get("/api/venter").then(res => {
				this.setState({ saving: false, conversation: undefined });
				this.findConversation();
			});
		});
	};
	findConversation = () => {
		axios.get("/api/conversation").then(res => {
			const { success, conversation } = res.data;
			if (success) {
				this.setState({ conversation: conversation });
			} else {
				setTimeout(() => {
					this.findConversation();
				}, 3000);
			}
		});
	};
	render() {
		const { saving, venter, listener, user, conversation } = this.state;

		return (
			<div className="master-container">
				{user &&
					!venter &&
					!listener && (
						<div className="center-container">
							<div className="option-container" onClick={this.becomeListener}>
								Person A
							</div>
							<div className="option-container" onClick={this.becomeVenter}>
								Person B
							</div>
						</div>
					)}
				{(venter || listener) && (
					<div className="center-container">
						{listener && (
							<div className="side-small-box" onClick={this.becomeVenter}>
								Person B
							</div>
						)}
						{venter && (
							<div className="side-small-box" onClick={this.becomeListener}>
								Person A
							</div>
						)}
						<Chat conversation={conversation} user={user} />
					</div>
				)}
				{saving && <Loader />}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { user: state.user };
}
function mapDispatchToProps(dispatch) {
	return bindActionCreators({ setUser: setUser }, dispatch);
}
export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MainPage);
