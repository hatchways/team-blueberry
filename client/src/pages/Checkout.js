import React, { useEffect, useContext } from "react";
import { usePageLoaded } from "../hooks";
import {
  CardElement,
  Elements,
  Stripe,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent, confirmPaymentIntent } from "../services";
import loadingContext from "../loadingContext";

const showCart = (cart) => {
  // only show most recent
  const item = cart[0];
  return (
    <table>
      <tbody>
        <tr className="">
          <td>Item</td>
          <td>Quantity</td>
          <td>Unit Cost</td>
          <td>Total Cost</td>
        </tr>
        <tr className="">
          <td className="">{item.name}</td>
          <td className="">{item.quantity}</td>
          <td className="">${item.unitCost}</td>
          <td className="">${item.unitCost * item.quantity}</td>
        </tr>
      </tbody>
    </table>
  );
};

const Checkout = ({ state, dispatch }) => {
  const stripePromise = loadStripe(state.secret.STRIPE_API_KEY);
  usePageLoaded(dispatch);
  return (
    <>
      <h1>Checkout</h1>
      <h2>Cart:</h2>
      {showCart(state.cart)}
      <Elements stripe={stripePromise}>
        <StripeForm
          cart={state.cart}
          secret={state.secret}
          dispatch={dispatch}
        />
      </Elements>
    </>
  );
};

const StripeForm = ({ cart, secret, dispatch }) => {
  const loading = useContext(loadingContext);
  const stripe = useStripe(secret.STRIPE_API_KEY);
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log(
        "Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded."
      );
      return;
    }

    await createPaymentIntent({ cart })(dispatch);
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
    const result = await stripe.confirmCardPayment(secret.clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });
    if (error) {
      return dispatch({ type: "CREATE_PAYMENT_INTENT_ERROR", error });
    }
    return confirmPaymentIntent(result.id)(dispatch);
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || loading}>
        Pay
      </button>
    </form>
  );
};
export default Checkout;
