import React from "react";
import loadable from "@loadable/component";
import { Space } from "antd";

const Container = loadable(() =>
  import("../../components/containers/Container")
);
const Page = loadable(() => import("../../components/containers/Page"));
const SubscribeColumn = loadable(() =>
  import("../../components/SubscribeColumn")
);

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
                Supportive comments only. We encourage everyone to comment on
                vents, but all comments must be supportive even if you disagree
                with the content of the vent.
              </li>
              <li>
                People who create racist, sexist, prejudice or discriminatory
                content will be permanently banned without warning.
              </li>
              <li>
                Any form of harassment, bullying, or attacking of people through
                vents, comments, or direct messages will cause you to be
                permanently banned without warning.
              </li>
              <li>
                To protect from predators, we do not allow advertising of any
                social media profiles or pages.
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
