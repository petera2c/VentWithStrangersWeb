import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, Space } from "antd";
import axios from "axios";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    axios.post("http://localhost:5002/subscribe", { paymentMethod, email: "" });
  };

  return (
    <form className="x-fill bg-grey-2 pa16 br8" onSubmit={handleSubmit}>
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

const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");

const App = () => (
  <Page
    className="align-center bg-grey-2"
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
