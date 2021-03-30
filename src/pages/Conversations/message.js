import React, { useState } from "react";
import moment from "moment-timezone";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";

import ConfirmAlertModal from "../../components/modals/ConfirmAlert";
import Container from "../../components/containers/Container";

import Text from "../../components/views/Text";

import { capitolizeFirstChar, isMobileOrTablet } from "../../util";
import { deleteMessage } from "./util";

function Message({ conversationID, message, setMessages, userID }) {
  const [deleteMessageConfirm, setDeleteMessageConfirm] = useState(false);
  const [messageOptions, setMessageOptions] = useState(false);
  const [reportModal, setReportModal] = useState(false);

  return (
    <Container className={"x-fill " + (message.userID !== userID ? "" : "")}>
      <div
        className={
          "message-container relative px16 py8 mb8 br4 " +
          (message.userID === userID ? "bg-blue white" : "grey-1 bg-grey-10")
        }
      >
        {message.body}
        <div
          className={"message-date align-center ov-visible left"}
          onMouseLeave={() => setMessageOptions(false)}
        >
          <FontAwesomeIcon
            className="clickable grey-9 px8"
            icon={faEllipsisV}
            onClick={() => {
              setMessageOptions(!messageOptions);
            }}
          />
          <div
            className="relative bg-grey-8 white pa4 br4"
            style={{ zIndex: 1 }}
          >
            {moment(message.server_timestamp).format("YYYY MMM DD h:mm A")}

            {messageOptions && (
              <div className="absolute top-100 left-0 pt4">
                <Container className="column x-fill bg-white border-all px16 py8 br8">
                  <Container
                    className="button-8 clickable align-center"
                    onClick={e => {
                      e.preventDefault();
                      if (message.userID === userID) {
                        setDeleteMessageConfirm(true);
                        setMessageOptions(false);
                      } else {
                        setReportModal(!reportModal);
                      }
                    }}
                  >
                    <Text
                      className="flex-fill"
                      text={
                        message.userID === userID
                          ? "Delete Message"
                          : "Report User"
                      }
                      type="p"
                    />
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
          </div>
        </div>
      </div>
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
