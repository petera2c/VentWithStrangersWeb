import React, { useEffect, useState } from "react";
import { Button, message, Space } from "antd";

import { createShareLink, getSecondUID } from "./util";

function UniqueShareLink({ user }) {
  const [secondUID, setSecondUID] = useState("");

  useEffect(() => {
    if (user) getSecondUID(setSecondUID, user.uid);
  }, [user]);

  return (
    <Space align="start" className="x-fill">
      <Space
        align="center"
        className="column bg-white pa16 br8"
        direction="vertical"
      >
        <h4 className="tac">Gain 50 karma points!</h4>
        <p className="tac">
          Share our site! No one will know your profile or username from your
          unique link. Upon a user signing up from your link you will receive 50
          karma points :)
        </p>
        <Button
          onClick={() => {
            navigator.clipboard.writeText(createShareLink(secondUID));
            message.success("Copied Successfully :)");
          }}
          size="large"
          type="primary"
        >
          Get Share Link!
        </Button>
      </Space>
    </Space>
  );
}

export default UniqueShareLink;
