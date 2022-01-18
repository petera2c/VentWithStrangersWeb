import React from "react";
import { Space } from "antd";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";

function RulesPage() {
  return (
    <Page
      className="pa16"
      description="Constructive. Feedback. Only"
      title="VWS Rules"
    >
      <Container>
        <Space
          className="flex-fill align-center bg-white pa32 br8"
          direction="vertical"
          size="large"
        >
          <h1 className="tac">VWS Rules</h1>

          <ol>
            <Space direction="vertical" size="large">
              <li>
                No racist/sexist/prejudice/discriminatory vents, comments, or
                direct messages. Grouping/categorizing people and judging them
                en masse is unacceptable in our community.
              </li>
              <li>
                No harassment, no bullying, and no attacking of users through
                vents, comments, or direct messages.
              </li>
              <li>
                To protect from predators, we do not allow advertising of any
                social media profiles or pages.
              </li>
              <li>
                Supportive comments only. We encourage all users to comment on
                vents, but all comments must be supportive even if you disagree
                with the content of the vent.
              </li>
              <li>Have fun! :)</li>
            </Space>
          </ol>
        </Space>
        <SubscribeColumn slot="5139839598" />
      </Container>
    </Page>
  );
}

export default RulesPage;
