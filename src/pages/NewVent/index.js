import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import { UserContext } from "../../context";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";

import StarterModal from "../../components/modals/Starter";
import NewVentComponent from "../../components/NewVent";

import { isMobileOrTablet } from "../../util";

function NewVentPage() {
  const location = useLocation();
  const { user } = useContext(UserContext);

  const { search } = location;
  const [starterModal, setStarterModal] = useState(!user);

  return (
    <Page
      className="column align-center bg-grey-2"
      description="You aren’t alone, and you should never feel alone. If you are feeling down, anonymously post your issue here. There is an entire community of people that want to help you."
      keywords=""
      title="Vent To Strangers"
    >
      <Container
        className={
          "ov-visible column py32 " +
          (isMobileOrTablet()
            ? "container mobile-full px16"
            : "container large")
        }
      >
        <h4 className="fw-600 mb16">Post Your Vent | Vent To Strangers</h4>
        <NewVentComponent ventID={search ? search.substring(1) : null} />
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
