import React from "react";
import Box from "@material-ui/core/Box";

export default function PageHeader(props) {
  return (
    <Box
      mt={2}
      fontSize="h4.fontSize"
      fontWeight="fontWeightBold"
      textAlign="center"
    >
      {props.children}
    </Box>
  );
}
