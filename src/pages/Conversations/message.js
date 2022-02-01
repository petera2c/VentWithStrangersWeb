import React, { useState } from "react";
import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";

import ConfirmAlertModal from "../../components/modals/ConfirmAlert";
import Container from "../../components/containers/Container";

import { urlify } from "../../util";
import { deleteMessage } from "./util";

function Message({ conversationID, message, setMessages, userID }) {
  const [deleteMessageConfirm, setDeleteMessageConfirm] = useState(false);
  const [messageOptions, setMessageOptions] = useState(false);
  const [reportModal, setReportModal] = useState(false);

  return (
    <Container className="x-fill">
      <Container
        className={
          "mb8 br4 " + (message.userID === userID ? "bg-blue" : "bg-grey-10")
        }
        style={{ maxWidth: "80%" }}
      >
        <div className="flex-fill description px16 py8">
          {urlify(message.body).map((obj, index) => {
            return (
              <p
                className={
                  "description " +
                  (message.userID === userID ? "white" : "grey-1")
                }
                key={index}
              >
                {obj}
              </p>
            );
          })}
        </div>
        <Container className="relative br4">
          <Container
            className="clickable align-end pr2"
            onClick={() => {
              setMessageOptions(!messageOptions);
            }}
            onMouseLeave={() => setMessageOptions(false)}
          >
            <p
              className={
                "fs-12 " + (message.userID === userID ? "white" : "grey-1")
              }
            >
              {moment(message.server_timestamp).format("h:mm A")}
            </p>
          </Container>
          {messageOptions && (
            <div className="absolute top-100 left-0 pt4" style={{ zIndex: 1 }}>
              <Container className="column x-fill bg-white border-all px16 py8 br8">
                <Container
                  className="button-8 clickable align-center"
                  onClick={(e) => {
                    e.preventDefault();
                    if (message.userID === userID) {
                      setDeleteMessageConfirm(true);
                      setMessageOptions(false);
                    } else {
                      setReportModal(!reportModal);
                    }
                  }}
                >
                  <p className="flex-fill">
                    {message.userID === userID
                      ? "Delete Message"
                      : "Report Message"}
                  </p>
                  <FontAwesomeIcon
                    className="ml8"
                    icon={
                      message.userID === userID
                        ? faTrash
                        : faExclamationTriangle
                    }
                  />
                </Container>
              </Container>
            </div>
          )}
        </Container>
      </Container>
      {deleteMessageConfirm && (
        <ConfirmAlertModal
          close={() => setDeleteMessageConfirm(false)}
          message="Are you sure you would like to delete this message?"
          submit={() => deleteMessage(conversationID, message.id, setMessages)}
          title="Delete Message"
        />
      )}
    </Container>
  );
}

export default Message;
