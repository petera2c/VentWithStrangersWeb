import React, { Component } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

import Container from "../../containers/Container";
import Text from "../../views/Text";
import Button from "../../views/Button";

import { login } from "./util";

import "./style.css";

function LoginPage({ close, openSignUpModal }) {
  const { register, handleSubmit } = useForm();

  return (
    <Container className="modal-container full-center">
      <Container className="modal container medium column align-center ov-auto bg-white br4">
        <Container className="x-fill justify-center bg-blue py16">
          <Text className="tac white" text="Log in to your Account" type="h4" />
        </Container>
        <Container className="x-fill column">
          <Container className="x-fill full-center px32">
            <Text className="x-fill tac border-bottom py16" type="p">
              Don't have an account?&nbsp;
              <Text
                className="clickable blue"
                onClick={() => openSignUpModal()}
                type="span"
              >
                Create One
              </Text>
            </Text>
          </Container>
          <form
            className="x-fill column"
            onSubmit={handleSubmit(formData => login(formData, close))}
          >
            <Container className="x-fill column px32 py16">
              <Text className="fw-400 mb8" text="Email Address" type="h5" />
              <input
                className="py8 px16 mb8 br4"
                type="text"
                name="email"
                placeholder="Email"
                ref={register}
                required
              />
              <Text className="fw-400 mb8" text="Password" type="h5" />
              <input
                className="py8 px16 mb8 br4"
                name="password"
                type="password"
                placeholder="Password"
                ref={register}
                required
              />
            </Container>
            <Container className="x-fill full-center border-top px32 py16">
              <Button
                className="x-fill bg-blue white py8 br4"
                text="Log in"
                type="submits"
              />
            </Container>
          </form>
        </Container>
      </Container>
      <Container className="modal-background" onClick={close} />
    </Container>
  );
}

export default LoginPage;
