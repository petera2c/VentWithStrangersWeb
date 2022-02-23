import React, { useState } from "react";
import { Dropdown } from "antd";

import { faEdit } from "@fortawesome/pro-solid-svg-icons/faEdit";
import { faEllipsisV } from "@fortawesome/pro-solid-svg-icons/faEllipsisV";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons/faExclamationTriangle";
import { faTrash } from "@fortawesome/pro-solid-svg-icons/faTrash";
import { faUserLock } from "@fortawesome/pro-solid-svg-icons/faUserLock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../containers/Container";
import ConfirmAlertModal from "../modals/ConfirmAlert";
import ReportModal from "../modals/Report";

import { blockUser } from "../../util";

function OptionsComponent({
  canUserInteractFunction,
  deleteFunction,
  editFunction,
  objectID,
  objectUserID,
  reportFunction,
  userID,
}) {
  const [blockModal, setBlockModal] = useState();
  const [reportModal, setReportModal] = useState();

  return (
    <Container
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Dropdown
        overlay={
          <Container className="column bg-white shadow-2 br8 gap8 pa16">
            {objectUserID === userID && (
              <Container
                className="button-8 clickable align-center justify-between gap8"
                onClick={(e) => {
                  e.preventDefault();
                  editFunction(objectID);
                }}
              >
                <p className="ic">Edit</p>
                <FontAwesomeIcon icon={faEdit} />
              </Container>
            )}
            {objectUserID === userID && (
              <Container
                className="button-8 clickable align-center justify-between gap8"
                onClick={(e) => {
                  e.preventDefault();
                  deleteFunction(objectID);
                }}
              >
                <p className="ic">Delete</p>
                <FontAwesomeIcon icon={faTrash} />
              </Container>
            )}
            {objectUserID !== userID && (
              <Container
                className="button-8 clickable align-center justify-between gap8"
                onClick={(e) => {
                  e.preventDefault();
                  if (canUserInteractFunction) return canUserInteractFunction();

                  setReportModal(!reportModal);
                }}
              >
                <p className="ic">Report</p>
                <FontAwesomeIcon icon={faExclamationTriangle} />
              </Container>
            )}
            {objectUserID !== userID && (
              <Container
                className="button-8 clickable align-center justify-between gap8"
                onClick={(e) => {
                  e.preventDefault();
                  if (canUserInteractFunction) return canUserInteractFunction();

                  setBlockModal(!blockModal);
                }}
              >
                <p className="ic">Block User</p>
                <FontAwesomeIcon icon={faUserLock} />
              </Container>
            )}
          </Container>
        }
        placement="bottomRight"
        trigger={["click"]}
      >
        <Container className="clickable pa16">
          <FontAwesomeIcon className="grey-9" icon={faEllipsisV} />
        </Container>
      </Dropdown>

      {reportModal && (
        <ReportModal
          close={() => setReportModal(false)}
          submit={(option) => {
            if (canUserInteractFunction) return canUserInteractFunction();

            reportFunction(option);
          }}
        />
      )}
      {blockModal && (
        <ConfirmAlertModal
          close={() => setBlockModal(false)}
          message="Blocking this user will remove you from all conversations with this user and you will no longer see any of their content. Are you sure you would like to block this user?"
          submit={() => {
            if (canUserInteractFunction) return canUserInteractFunction();

            blockUser(userID, objectUserID);
          }}
          title="Block User"
        />
      )}
    </Container>
  );
}

export default OptionsComponent;
