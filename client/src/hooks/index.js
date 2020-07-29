import { useEffect } from "react";

const usePageLoaded = (dispatch) => {
  useEffect(() => dispatch({ type: "FINISH_LOAD" }), [dispatch]);
};

export { usePageLoaded };
