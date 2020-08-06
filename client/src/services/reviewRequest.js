import axios from "axios";

export const sendRequest = async (isAccepted, requestId) => {
  try {
    await axios({
      method: "POST",
      data: {
        isAccepted,
        requestId,
      },
      withCredentials: true,
      url: "/api/user/request",
    });
  } catch (error) {
    // TODO - need better error handling
    return console.error("Fail to post request");
  }
};

export const getRequest = async (reviewId) => {
  try {
    const res = await axios({
      method: "GET",
      params: {
        reviewId,
      },
      withCredentials: true,
      url: `/api/user/request/${reviewId}`,
    });
    return res.data;
  } catch (err) {
    // TODO - need better error handling
    return console.error(err);
  }
};
