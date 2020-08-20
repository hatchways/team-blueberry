import axios from "axios";

export const sendRequest = async (isAccepted, requestId, dispatch) => {
  try {
    dispatch({ type: "STATUS_SENT" });
    await axios({
      method: "POST",
      data: {
        isAccepted,
        requestId,
      },
      withCredentials: true,
      url: "/api/user/request",
    });
    if (isAccepted)
      dispatch({
        type: "STATUS_ACCEPTED",
        status: "accepted",
      });
    else
      dispatch({
        type: "STATUS_DECLINED",
        status: "declined",
        review: null,
        selectedReviewer: null,
      });
  } catch (error) {
    dispatch({ type: "STATUS_ERROR", error: error.message });
  }
};
