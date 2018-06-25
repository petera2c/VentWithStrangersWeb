import React, { Component } from "react";
import moment from "moment";
import axios from "axios";

import SmallLoader from "../SmallLoader/";

import "./Styles/";

class Loader extends Component {
	state = {
		message: "",
		conversation: this.props.conversation,
		messages: []
	};
	componentWillReceiveProps(nextProps) {
		this.setState({ conversation: nextProps.conversation });
	}
	componentDidUpdate() {
		if (this.state.conversation) this.scrollToBottom();
	}
	getMessages = () => {
		const { conversation } = this.state;
		axios.get("/api/messages/" + conversation._id).then(res => {
			const { success, messages } = res.data;
			if (success) {
				this.setState({ messages: messages });
			} else {
				setTimeout(() => {
					this.findConversation();
				}, 3000);
			}
		});
	};
	sendMessage = () => {
		const { message, conversation } = this.state;
		let { messages } = this.state;

		axios.post("/api/message", { message: message, conversation: conversation }).then(res => {
			this.getMessages();
		});
	};
	handleChange = (value, index) => {
		this.setState({ [index]: value });
	};
	scrollToBottom = () => {
		this.messagesEnd.scrollIntoView({ behavior: "smooth" });
	};
	render() {
		const { message, conversation, messages } = this.state;
		const { user } = this.props;

		let messageDivs = [];
		for (let index in messages) {
			let direction = "left";
			let message = messages[index];

			if (message.author === user._id) direction = "right";
			//					<div className="message-time">{new moment(message.createdAt).format("HH:mm")}</div>

			messageDivs.push(
				<div className={"message-container " + direction} key={index + "message"}>
					<div className="message-body">{message.body}</div>
				</div>
			);
		}

		return (
			<div className="chat-container">
				{conversation && (
					<div className="messages-container">
						{messageDivs}
						<div
							style={{ float: "left", clear: "both" }}
							ref={el => {
								this.messagesEnd = el;
							}}
						/>
					</div>
				)}
				{!conversation && <SmallLoader />}
				{conversation && (
					<div className="send-message-container">
						<textarea
							className="send-message-textarea"
							onChange={event => this.handleChange(event.target.value, "message")}
							value={message}
						/>
						<button className="send-message" onClick={this.sendMessage}>
							Send
						</button>
					</div>
				)}
			</div>
		);
	}
}

export default Loader;
