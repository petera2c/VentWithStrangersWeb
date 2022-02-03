import React, { useEffect, useState } from "react";
import loadable from "@loadable/component";
import { Button, message } from "antd";

const Container = loadable(() => import("../../containers/Container"));

function UniqueShareLink({ user }) {
  const [secondUID, setSecondUID] = useState("");

  useEffect(() => {
    if (user) {
      import("./util").then((functions) => {
        functions.getSecondUID(setSecondUID, user.uid);
      });
    }
  }, [user]);

  return (
    <Container className="x-fill align-start gap8">
      <Container className="column align-center bg-white br8 gap8 pa16">
        <h4 className="tac">Gain 50 karma points!</h4>
        <p className="tac">
          Share our site! No one will know your profile or username from your
          unique link. Upon a user signing up from your link you will receive 50
          karma points :)
        </p>
        <Button
          onClick={() => {
            import("./util").then((functions) => {
              navigator.clipboard.writeText(
                functions.createShareLink(secondUID)
              );
            });
            message.success("Copied Successfully :)");
          }}
          size="large"
          type="primary"
        >
          Get Share Link!
        </Button>
      </Container>
    </Container>
  );
}

export default UniqueShareLink;
