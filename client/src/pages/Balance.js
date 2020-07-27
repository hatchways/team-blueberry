import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import userContext from "../userContext";
import Background from "../elements/Background";
import StyledPaper from "../elements/StyledPaper";
import PageHeader from "../elements/PageHeader";
import {
  Button,
  Card,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Typography,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";

const BalancePage = ({ state, dispatch }) => {
  const priorTopUp = state.cart.find((item) => item.name === "Review Credits")
    ?.quantity;
  const user = useContext(userContext);
  const [topUp, setTopUp] = useState(() => priorTopUp || 2);
  const history = useHistory();

  const handleClick = ({ target, ...e }) => {
    const { id } = target.closest("button");
    if (id === "incr") return setTopUp(() => topUp + 1);
    if (id === "decr" && topUp > 0) return setTopUp(topUp - 1);
  };

  const handleCheckout = (e) => {
    dispatch({
      type: "ADD_ITEM_TO_CART",
      item: { name: "Review Credits", quantity: topUp, unitCost: 10 },
    });
    history.push("/checkout");
  };

  return (
    <Background solid>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <StyledPaper mt={20}>
          {/* Page Heading */}
          <PageHeader>Your Balance:</PageHeader>
          <Typography
            component="p"
            variant="h6"
            color="secondary"
            paragraph={true}
          >
            {user.balance} credits
          </Typography>
          <Divider style={{ alignSelf: "stretch" }} variant="fullWidth" />
          {/* Page Form */}
          <Typography component="h2" variant="h5">
            Top Up:
          </Typography>
          <Card variant="outlined" style={{}}>
            <Grid
              container
              direction="row"
              alignItems="center"
              alignContent="center"
              justify="space-between"
              style={{ display: "flex" }}
              wrap="nowrap"
            >
              <Grid item>
                <Button
                  onClick={handleClick}
                  id="decr"
                  variant="contained"
                  size="small"
                  disabled={state.loading || !topUp}
                  aria-label="Subtract Credit"
                >
                  <RemoveIcon />
                </Button>
              </Grid>
              <Grid item>
                <Typography
                  aria-label="Credits to Purchase"
                  component="h2"
                  variant="h6"
                >
                  {topUp}
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  onClick={handleClick}
                  id="incr"
                  variant="contained"
                  size="small"
                  disabled={state.loading}
                  aria-label="Add Credit"
                >
                  <AddIcon />
                </Button>
              </Grid>
            </Grid>
          </Card>
          <Button
            variant="contained"
            color="primary"
            disabled={state.loading}
            onClick={handleCheckout}
          >
            Checkout
          </Button>
        </StyledPaper>
      </Container>
    </Background>
  );
};

export default BalancePage;
