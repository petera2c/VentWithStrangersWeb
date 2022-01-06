import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button, Space } from "antd";

import { firebaseApp } from "../../../config/firebase";

import Page from "../../../components/containers/Page";
import Container from "../../../components/containers/Container";

import { handleVerifyEmail } from "./util";

function VerifiedEmail() {
  const [verifiedSuccessly, setVerifiedSuccessly] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const location = useLocation();
  let { search } = location;

  useEffect(() => {
    const oobCode = /oobCode=([^&]+)/.exec(search)[1];

    handleVerifyEmail(
      firebaseApp.auth(),
      oobCode,
      setErrorMessage,
      setVerifiedSuccessly
    );
  }, []);

  return (
    <Page className="column bg-grey-2" description="" title="Email Verified">
      <Space align="center" className="py32" direction="vertical">
        <Space
          align="center"
          className="container large bg-white pa16 br8"
          direction="vertical"
          size="small"
        >
          <Space direction="vertical">
            <h1 className="tac">
              {!errorMessage
                ? verifiedSuccessly
                  ? "Email Verified successfully :)"
                  : "Loading"
                : "Please try again :'("}
            </h1>

            <p className="tac mb16">
              {!errorMessage
                ? verifiedSuccessly
                  ? "Click continue' to go home!"
                  : "Loading"
                : errorMessage}
            </p>
          </Space>
          {verifiedSuccessly && (
            <Link to="/">
              <Button size="large" type="primary">
                Continue
              </Button>
            </Link>
          )}
        </Space>
      </Space>
    </Page>
  );
}

export default VerifiedEmail;
