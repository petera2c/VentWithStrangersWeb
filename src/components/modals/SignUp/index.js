import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";

import Container from "../../containers/Container";
import Text from "../../views/Text";
import Button from "../../views/Button";

import { isMobileOrTablet } from "../../../util";
import { signUp } from "./util";

function SignUpModal({ setActiveModal }) {
  const { register, handleSubmit } = useForm();
  const [canSeePassword, setCanSeePassword] = useState(false);

  return (
    <Container className="modal-container full-center">
      <Container className="modal container medium column align-center ov-auto bg-white br4">
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
            <Container className="column x-fill full-center border-top px32 py16">
              <Button
                className="x-fill bg-blue white py8 br4"
                text="Create Account"
                type="submit"
              />

              <p className="x-fill tac mt8">
                Already have an account?&nbsp;
                <span
                  className="clickable blue"
                  onClick={e => {
                    e.preventDefault();
                    setActiveModal("login");
                  }}
                >
                  Login
                </span>
              </p>
            </Container>
          </form>
        </Container>
      </Container>
      <Container
        className="modal-background"
        onClick={() => setActiveModal("")}
      />
    </Container>
  );
}

export default SignUpModal;
