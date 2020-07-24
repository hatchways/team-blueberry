import React, { useContext, useState } from "react";
import userContext from "../userContext";
import Background from "../elements/Background";
import StyledPaper from "../elements/StyledPaper";
import PageHeader from "../elements/PageHeader";
import { Container, CssBaseline } from "@material-ui/core";

const BalancePage = ({ state, dispatch }) => {
  const user = useContext(userContext);
  const [topUp, setTopUp] = useState(2);

  return (
    <Background solid>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <StyledPaper mt={20}>
          {/* section */}
          <PageHeader>Your Balance:</PageHeader>
          {/* `${user.balance} credits` */}
          {/* hr */}
          {/* section */}
          <h4>Top Up:</h4>
          {/* form incr, decr, value */}
          {/* form submit checkout */}
        </StyledPaper>
      </Container>
    </Background>
  );
};

export default BalancePage;
