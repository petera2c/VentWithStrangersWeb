import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";

import { faBirthdayCake } from "@fortawesome/pro-duotone-svg-icons/faBirthdayCake";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../../components/containers/Container";
import NewVentComponent from "../../../components/NewVent";
import Page from "../../../components/containers/Page";
import StarterModal from "../../../components/modals/Starter";
import SubscribeColumn from "../../../components/SubscribeColumn";

import { UserContext } from "../../../context";

function NewVentPage() {
  const location = useLocation();

  const { user } = useContext(UserContext);

  const { search } = location;
  const [starterModal, setStarterModal] = useState(!user);

  return (
    <Page className="pa16" title="Happy Birthday!">
      <Container>
        <Container className="column flex-fill gap16">
          <Container className="full-center gap8">
            <h1 className="tac">Happy Birthday! ☺️ ☺️</h1>
            <FontAwesomeIcon className="blue" icon={faBirthdayCake} size="5x" />
          </Container>
          <NewVentComponent
            isBirthdayPost
            ventID={search ? search.substring(1) : null}
          />
        </Container>
        <SubscribeColumn slot="3226323822" />
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
