import React, { useEffect, useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import { usePageLoaded } from "../hooks";

import Background from "../elements/Background";
import StyledPaper from "../elements/StyledPaper";
import PageHeader from "../elements/PageHeader";
import SubmitButton from "../elements/SubmitButton";

import {
  Container,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
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

const useStyles = makeStyles((theme) => ({
  total: {
    padding: theme.spacing(1),
  },
  stripeForm: {
    margin: theme.spacing(2),
    padding: theme.spacing(1),
  },
}));

const showCart = (cart) => {
  // only show most recent
  return (
    <>
      <Table aria-label="Shopping Cart">
        <TableHead>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit Cost</TableCell>
            <TableCell>Item Cost</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cart.map((item) => (
            <TableRow key={item.name}>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.quantity}</TableCell>
              <TableCell>${item.unitCost}</TableCell>
              <TableCell>${item.unitCost * item.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

const stripePromise = loadStripe(STRIPE_API_KEY);
const Checkout = ({ state, dispatch }) => {
  const classes = useStyles();
  usePageLoaded(dispatch);
  return (
    <Background solid>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <StyledPaper mt={20}>
          <PageHeader>Checkout</PageHeader>
          <h2>Cart:</h2>
          {showCart(state.cart)}
          <Typography className={classes.total} variant="h6" component="h2">
            Total: $
            {state.cart.reduce(
              (total, item) => total + item.quantity * item.unitCost,
              0
            )}
          </Typography>
          <Container className={classes.stripeForm}>
            <Elements stripe={stripePromise}>
              <StripeForm
                cart={state.cart}
                secret={state.secret}
                dispatch={dispatch}
              />
            </Elements>
          </Container>
        </StyledPaper>
      </Container>
    </Background>
  );
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
      <CardElement options={CARD_OPTIONS} />
      <SubmitButton disabled={!stripe || loading}>Pay</SubmitButton>
    </form>
  );
};
export default Checkout;
