import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../context";

import Container from "../../components/containers/Container";
import NewVentComponent from "../../components/NewVent";
import Page from "../../components/containers/Page";
import StarterModal from "../../components/modals/Starter";
import SubscribeColumn from "../../components/SubscribeColumn";

function NewVentPage() {
  const location = useLocation();
  const { user } = useContext(UserContext);

  const { search } = location;
  const [starterModal, setStarterModal] = useState(!user);

  return (
    <Page
      className="pa16"
      description="You aren’t alone, and you should never feel alone. If you are feeling down, anonymously post your issue here. There is an entire community of people that want to help you."
      keywords=""
      title="Vent To Strangers"
    >
      <Container>
        <Container className="flex-fill ">
          <NewVentComponent ventID={search ? search.substring(1) : null} />
        </Container>
        <SubscribeColumn slot="3872937497" />
      </Container>

      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Page>
  );
}

export default NewVentPage;
