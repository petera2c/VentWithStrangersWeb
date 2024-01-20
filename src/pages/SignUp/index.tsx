import React, { useState } from "react";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import StarterModal from "../../components/modals/Starter";
import SubscribeColumn from "../../components/SubscribeColumn";

function SignUpPage() {
  const [starterModal, setStarterModal] = useState(true);

  return (
    <Page className="pa16" title="Sign Up">
      <Container>
        <Container className="flex-fill full-center bg-white pa16 br8">
          <h1
            className="grey-1 clickable tac"
            onClick={() => setStarterModal(true)}
          >
            Please <span className="blue">sign in</span> to view your profile :)
          </h1>
        </Container>
        <SubscribeColumn slot="2023362297" />
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

export default SignUpPage;
