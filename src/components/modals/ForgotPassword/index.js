import React from "react";
import { useForm } from "react-hook-form";

import Container from "../../containers/Container";
import Text from "../../views/Text";
import Button from "../../views/Button";

import { isMobileOrTablet } from "../../../util";
import { sendPasswordReset } from "./util";

function ForgotPasswordModal({ setActiveModal }) {
  const { register, handleSubmit } = useForm();

  return (
    <Container className="modal-container full-center">
      <Container className="modal container medium column align-center ov-auto bg-white br4">
        <Container className="x-fill justify-center bg-blue py16">
          <Text className="tac white" text="Password Reset" type="h4" />
        </Container>

        <Container className="x-fill column">
          <Container className="x-fill full-center px32">
            <Text className="x-fill tac border-bottom py16" type="p">
              Already have an account?&nbsp;
              <Text
                className="clickable blue"
                onClick={() => setActiveModal("login")}
                type="span"
              >
                Login
              </Text>
            </Text>
          </Container>

          <form
            className="x-fill column"
            onSubmit={handleSubmit(data => sendPasswordReset(data))}
          >
            <Container className="x-fill column px32 py16">
              <Text className="fw-400 mb8" text="Email" type="h5" />
              <input
                className="py8 px16 mb8 br4"
                type="text"
                name="email"
                placeholder="abc@gmail.com"
                ref={register}
                required
              />
            </Container>
            <Container className="x-fill full-center border-top px32 py16">
              <Button
                className="x-fill bg-blue white py8 br4"
                text="Send Email Password Reset Link"
                type="submit"
              />
            </Container>
          </form>
        </Container>
      </Container>
      <Container className="modal-background" onClick={close} />
    </Container>
  );
}

export default ForgotPasswordModal;
