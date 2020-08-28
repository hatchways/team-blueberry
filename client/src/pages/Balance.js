import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import userContext from "../userContext";
import Background from "../elements/Background";
import StyledPaper from "../elements/StyledPaper";
import PageHeader from "../elements/PageHeader";
import SubmitButton from "../elements/SubmitButton";
import {
  Button,
  Card,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Typography,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { reviewCredits } from "../utils/itemLookup";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
    textAlign: "center",
  },
  formChild: {
    margin: theme.spacing(2),
    padding: "12px",
    maxWidth: "220px",
    minWidth: "160px",
    border: "1px solid #D3D3D3",
    borderRadius: "20px",
  },
  formTypography: {
    margin: theme.spacing(2),
    padding: theme.spacing(1),
  },
  divider: {
    marginRight: theme.spacing(-5),
    marginLeft: theme.spacing(-5),
    alignSelf: "stretch",
  },
  button: {
    maxWidth: "30px",
    maxHeight: "30px",
    minWidth: "30px",
    minHeight: "30px",
    backgroundColor: "#e4ebfd",
    color: theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
      color: "#FFF",
    },
  },
}));

const BalancePage = ({ state, dispatch }) => {
  const classes = useStyles();
  const priorTopUp = state?.cart?.find(
    (item) => item.name === reviewCredits.name
  )?.quantity;
  const user = useContext(userContext);
  const [topUp, setTopUp] = useState(
    () => priorTopUp || reviewCredits.quantity
  );
  const history = useHistory();

  const handleClick = ({ target, ...e }) => {
    const { id } = target.closest("button");
    if (id === "incr") return setTopUp(() => topUp + 1);
    if (id === "decr" && topUp > 0) return setTopUp(topUp - 1);
  };

  const handleCheckout = async (e) => {
    dispatch({
      type: "ADD_ITEM_TO_CART",
      item: { ...reviewCredits, quantity: topUp },
    });
    history.push("/checkout");
  };

  return (
    <Background solid>
      <Container component="main" maxWidth="sm">
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
          <Divider className={classes.divider} light />
          <form className={classes.form}>
            <Typography
              className={classes.formTypography}
              component="h2"
              variant="h5"
            >
              Top Up:
            </Typography>
            <Typography variant="body1">
              ${reviewCredits.unitCost} per Credit
            </Typography>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
            >
              <Box className={classes.formChild}>
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
                      className={classes.button}
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
                      className={classes.button}
                    >
                      <AddIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <SubmitButton
              variant="contained"
              color="primary"
              disabled={state.loading}
              onClick={handleCheckout}
            >
              Checkout
            </SubmitButton>
          </form>
        </StyledPaper>
      </Container>
    </Background>
  );
};

export default BalancePage;
