import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";
import Button from "../../components/views/Button";

import { isMobileOrTablet } from "../../util";
import { signUp } from "../../components/modals/SignUp/util";
import { UserContext } from "../../context";

function SignUpPage() {
  const history = useHistory();
  const user = useContext(UserContext);

  if (user) {
    alert("You can only access this page if you are not logged in!");
    history.push("/");
    return (
      <Page
        className="bg-grey-2 full-center pa32"
        title="Chat and Post Anonymously"
      />
    );
  }
  const { register, handleSubmit } = useForm();
  const [canSeePassword, setCanSeePassword] = useState(false);

  return (
    <Page className="bg-grey-2 full-center" title="Chat and Post Anonymously">
      <Container className="container extra-large">
        <h1 className="tac mb32">
          Chat Anonymously and Post Anonymously. Find strangers to vent with.
          Our community is waiting to help you.
        </h1>
      </Container>
      <Container className="container medium column align-center bg-white br4">
        <Container className="x-fill justify-center bg-blue py16">
          <Text className="tac white" text="Create an Account" type="h4" />
        </Container>

        <Container className="x-fill column">
          <form
            className="x-fill column"
            onSubmit={handleSubmit(data => signUp(data))}
          >
            <Container className="x-fill column px32 py16">
              <Text className="fw-400 mb8" text="Display Name" type="h5" />
              <input
                className="py8 px16 mb8 br4"
                type="text"
                name="displayName"
                placeholder="Art Vandalay"
                ref={register}
                required
              />
              <Text className="fw-400 mb8" text="Email Address" type="h5" />
              <input
                className="py8 px16 br4"
                name="email"
                type="text"
                placeholder="artvandalay@gmail.com"
                ref={register}
                required
              />
              <Text
                className="fw-400 mb8"
                text="(Your Email Address will never be shown to anyone.)"
                type="p"
              />
              <Container className="x-fill wrap">
                <Container
                  className={
                    "column " + (isMobileOrTablet() ? "x-100" : "x-50 pr8")
                  }
                >
                  <Text className="fw-400 mb8" text="Password" type="h5" />
                  <input
                    className="py8 px16 mb8 br4"
                    name="password"
                    type={canSeePassword ? "" : "password"}
                    placeholder="********"
                    ref={register}
                    required
                  />
                </Container>
                <Container
                  className={
                    "column " + (isMobileOrTablet() ? "x-100" : "x-50 pl8")
                  }
                >
                  <Text
                    className="fw-400 mb8"
                    text="Confirm Password"
                    type="h5"
                  />
                  <Container className="x-fill full-center">
                    <input
                      className="py8 px16 mb8 br4"
                      name="passwordConfirm"
                      type={canSeePassword ? "" : "password"}
                      placeholder="********"
                      ref={register}
                      required
                    />
                    <FontAwesomeIcon
                      className={
                        "clickable ml8 " + (canSeePassword ? "blue" : "")
                      }
                      icon={faEye}
                      onClick={() => setCanSeePassword(!canSeePassword)}
                    />
                  </Container>
                </Container>
              </Container>
            </Container>
            <Container className="x-fill full-center border-top px32 py16">
              <Button
                className="x-fill bg-blue white py8 br4"
                text="Create Account"
                type="submit"
              />
            </Container>
          </form>
        </Container>
      </Container>
    </Page>
  );
}

export default SignUpPage;
