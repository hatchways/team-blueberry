import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
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
const STRIPE_API_KEY =
  "pk_test_51H9aiQHBjJBD671jjlNd2YSaGTgUaRtAfrSOlF1271z4ftGZwKSP2UVI0XWHuQqzA5NAY7pv5FvuQj1LT47nokHG00DZWM1eoW";

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

const stripePromise = loadStripe(STRIPE_API_KEY);
const Checkout = ({ state, dispatch }) => {
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
  const history = useHistory();
  const loading = useContext(loadingContext);
  const stripe = useStripe(STRIPE_API_KEY);
  const elements = useElements();
  const [paymentMethod, setPaymentMethod] = useState();

  const handleConfirm = async (paymentMethod) => {
    try {
      const { paymentIntent } = await stripe.confirmCardPayment(
        secret.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );
      await confirmPaymentIntent(paymentIntent.id)(dispatch);
      history.push("/profile");
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (paymentMethod) handleConfirm(paymentMethod);
  }, [paymentMethod]);

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
    if (error) {
      return dispatch({ type: "CREATE_PAYMENT_INTENT_ERROR", error });
    }
    setPaymentMethod(paymentMethod);
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
