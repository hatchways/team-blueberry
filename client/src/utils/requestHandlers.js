// Import Axios
const axios = require("axios");

// Handle all requests to API here
const getFromAPI = async (config) => {
  try {
    const response = await axios(config);

    return response;
  } catch (error) {
    console.error(error);
    console.error(error.response.status);
    return false;
  }
};

const putToAPI = async (config) => {
  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error(error);
    console.log(error.response.status);
    return false;
  }
};

const postToAPI = async (config) => {
  try {
    const response = await axios(config);
    return response;
  } catch (error) {
    console.error(error.message, error.response.status);
    return false;
  }
};

export { getFromAPI, putToAPI, postToAPI };
