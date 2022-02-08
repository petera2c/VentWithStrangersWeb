import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, message } from "antd";
import axios from "axios";

import { UserContext } from "../../context";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";

const CheckoutForm = () => {
  const { user } = useContext(UserContext);

  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    const { paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    axios
      .post("/subscribe", {
        payment_method: paymentMethod.id,
        email: user.email,
      })
      .then((res) => {
        const { success } = res.data;
        if (success) navigate("/subscription-successful");
        else message.error(res.data.message);
      });
  };

  return (
    <form className="x-fill bg-blue-2 pa16 br8" onSubmit={handleSubmit}>
      <CardElement />
      <Container className="x-fill justify-end">
        <Button
          className="mt16"
          disabled={!stripe || !elements}
          onClick={handleSubmit}
          type="primary"
        >
          Pay
        </Button>
      </Container>
    </form>
  );
};

const stripePromise = loadStripe(
  window.location.hostname === "localhost"
    ? "pk_test_C6VKqentibktzCQjTRZ9vOuY"
    : "pk_live_fbteh655nQqpE4WEFr6fs5Pm"
);

const App = () => (
  <Page
    className="align-center bg-blue-2"
    description="Help Support Vent With Strangers"
    title="Subscribe"
  >
    <Container className="column container large align-center bg-white pa32 ma32 br8">
      <h1 className="grey-1 tac mb16">Subscribing will...</h1>
      <ul className="fs-18 primary mb16">
        <li>Get rid of ads</li>
        <li>All 'pay to use' future features</li>
      </ul>
      <Container className="full-center mb16">
        <p className="fs-24">$1</p>
        <p className="fs-24">/Month</p>
      </Container>

      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </Container>
  </Page>
);

export default App;
