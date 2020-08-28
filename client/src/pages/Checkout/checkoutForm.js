import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import SubmitButton from "../../elements/SubmitButton";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const getColor = (props) => {
  if (props.checkoutError) {
    return "#ff3d00";
  }
  return "#eeeeee";
};

const useStyles = makeStyles({
  formChild: {
    // margin: theme.spacing(2),
    padding: "12px",
    // maxWidth: "220px",
    // minWidth: "160px",
    border: "1px",
    borderStyle: "solid",
    borderColor: (props) => getColor(props),
    borderRadius: "5px",
  },
  error: {
    color: "#ff3d00",
  },
});

const CheckoutForm = ({ price, onSuccessfulCheckout }) => {
  const [isProcessing, setProcessingTo] = useState(false);
  const [checkoutError, setCheckoutError] = useState();
  const classes = useStyles({ checkoutError });

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
    hidePostalCode: true,
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <Grid container direction="column">
        <Grid item>
          <Box className={classes.formChild}>
            <CardElement
              options={CARD_OPTIONS}
              onChange={handleCardDetailsChange}
            />
          </Box>
          {checkoutError && (
            <Typography
              variant="caption"
              display="block"
              gutterBottom
              className={classes.error}
            >
              {checkoutError}
            </Typography>
          )}
        </Grid>
        <Grid item container justify="center">
          <SubmitButton disabled={isProcessing || !stripe}>
            {isProcessing ? "Processing..." : `Pay $${price}`}
          </SubmitButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default CheckoutForm;
