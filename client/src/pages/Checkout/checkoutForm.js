import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import SubmitButton from "../../elements/SubmitButton";
import Grid from "@material-ui/core/Grid";

const CheckoutForm = ({ price, onSuccessfulCheckout }) => {
  const [isProcessing, setProcessingTo] = useState(false);
  const [checkoutError, setCheckoutError] = useState();

  const stripe = useStripe();
  const elements = useElements();

  const handleCardDetailsChange = (ev) => {
    ev.error ? setCheckoutError(ev.error.message) : setCheckoutError();
  };

  const handleFormSubmit = async (ev) => {
    ev.preventDefault();

    setProcessingTo(true);

    const cardElement = elements.getElement("card");

    try {
      const { data: clientSecret } = await axios.post("/api/payment/", {
        amount: price * 100,
      });

      const paymentMethodReq = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
      });

      if (paymentMethodReq.error) {
        setCheckoutError(paymentMethodReq.error.message);
        setProcessingTo(false);
        return;
      }

      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodReq.paymentMethod.id,
      });

      if (error) {
        setCheckoutError(error.message);
        setProcessingTo(false);
        return;
      }

      onSuccessfulCheckout();
    } catch (err) {
      setCheckoutError(err.message);
    }
  };

  const CARD_OPTIONS = {
    iconStyle: "solid",
    style: {
      base: {
        fontWeight: 500,
        fontSize: "16px",
        fontSmoothing: "antialiased",
      },
      invalid: {
        iconColor: "#ffc7ee",
        color: "#ffc7ee",
      },
    },
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container justify="center">
        <Grid item>
          <CardElement
            options={CARD_OPTIONS}
            onChange={handleCardDetailsChange}
          />
          {checkoutError && <p>{checkoutError}</p>}
        </Grid>
        <Grid item>
          <SubmitButton disabled={isProcessing || !stripe}>
            {isProcessing ? "Processing..." : `Pay $${price}`}
          </SubmitButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default CheckoutForm;