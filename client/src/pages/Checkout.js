import React, { useEffect } from "react";
import { usePageLoaded } from "../hooks";
import {
  CardElement,
  Elements,
  Stripe,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { createPaymentIntent } from "../services";

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

const stripePromise = loadStripe("key");
const Checkout = ({ state, dispatch }) => {
  usePageLoaded(dispatch);
  useEffect(() => {
    createPaymentIntent({ cart: state.cart })(dispatch);
  }, [dispatch]);
  return (
    <>
      <h1>Checkout</h1>
      <h2>Cart:</h2>
      {showCart(state.cart)}
      <Elements stripe={stripePromise}>
        <StripeForm />
      </Elements>
    </>
  );
};

const StripeForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log(
        "Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded."
      );
      return;
    }

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};
export default Checkout;
