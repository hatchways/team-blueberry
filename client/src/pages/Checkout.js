import React from "react";
import { useHistory } from "react-router-dom";
import { usePageLoaded } from "../hooks";
import Background from "../elements/Background";
import StyledPaper from "../elements/StyledPaper";
import PageHeader from "../elements/PageHeader";
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
// import loadingContext from "../loadingContext";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./Checkout/checkoutForm";

const PUBLISHABLE_KEY =
  "pk_test_51HKme9FHPZChBCCstiGNkJ98SlG0jSuo1xPJpe895mp5eLkAiBEvjL4CgkjVw9wazUPUODqNWpL0iFXPGV3CyFxS00ah2pylSn";

const stripePromise = loadStripe(PUBLISHABLE_KEY);

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

const Checkout = ({ state, dispatch }) => {
  const classes = useStyles();
  const history = useHistory();
  usePageLoaded(dispatch);
  const price = state.cart[0].unitCost * state.cart[0].quantity;
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
              <CheckoutForm
                price={price}
                onSuccessfulCheckout={() => history.push("/")}
              />
            </Elements>
          </Container>
        </StyledPaper>
      </Container>
    </Background>
  );
};

export default Checkout;
