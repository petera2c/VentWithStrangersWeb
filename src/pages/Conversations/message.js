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

function Message({ message, userID }) {
  const [messageOptions, setMessageOptions] = useState(false);
  return (
    <Container
      className={
        "x-fill " + (message.userID !== userID ? "wrap" : "justify-end")
      }
    >
      <div
        className={
          "relative message-container px16 py8 mb8 br4 " +
          (message.userID === userID ? "bg-blue white" : "grey-1 bg-grey-10")
        }
      >
        {message.body}
        <div
          className={
            "message-date align-center ov-visible" +
            (message.userID === userID ? " right" : " left")
          }
        >
          {message.userID !== userID && (
            <FontAwesomeIcon
              className="clickable grey-9 px8"
              icon={faEllipsisV}
              onClick={() => {
                return;
                setMessageOptions(true);
              }}
            />
          )}
          <div className="bg-grey-8 white pa4 br4">
            {moment(message.server_timestamp).format("YYYY MMM DD h:mm A")}
          </div>
          {message.userID === userID && (
            <FontAwesomeIcon
              className="clickable grey-9 px8"
              icon={faEllipsisV}
              onClick={() => {
                return;
                setMessageOptions(true);
              }}
            />
          )}
        </div>
      </div>
    </Container>
  );
}

/*{messageOptions && (
  <div
    className="absolute flex right-0"
    style={{
      top: "calc(100% - 8px)",
      whiteSpace: "nowrap",
      zIndex: 1
    }}
  >
    <Container className="column x-fill bg-white border-all2 border-all px16 py8 br8">
      {message.userID === userID && (
        <Container
          className="button-8 clickable align-center"
          onClick={e => {
            e.preventDefault();
            setDeleteCommentConfirm(true);
            setMessageOptions(false);
          }}
        >
          <Text className="flex-fill" text="Delete Comment" type="p" />
          <FontAwesomeIcon className="ml8" icon={faTrash} />
        </Container>
      )}
      {message.userID !== userID && (
        <Container
          className="button-8 clickable align-center"
          onClick={e => {
            e.preventDefault();
            setReportModal(!reportModal);
          }}
        >
          <Text className="flex-fill" text="Report Comment" type="p" />
          <FontAwesomeIcon
            className="ml8"
            icon={faExclamationTriangle}
          />
        </Container>
      )}
    </Container>
  </div>
)}*/

export default Message;
