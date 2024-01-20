import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Container from "../../components/containers/Container";
import NewVentComponent from "../../components/NewVent";
import Page from "../../components/containers/Page";
import StarterModal from "../../components/modals/Starter";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

function NewVentPage() {
  const location = useLocation();

  const { user } = useContext(UserContext);

  const { search } = location;
  const [starterModal, setStarterModal] = useState(false);

  useEffect(() => {
    if (!user) {
      setStarterModal(true);
    } else setStarterModal(false);
  }, [setStarterModal, user]);

  return (
    <Page className="pa16">
      <Container>
        <Container className="flex-fill">
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
