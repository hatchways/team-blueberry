// Import Axios
const axios = require("axios");

// Handle all requests to API here
module.exports = {
  async getFromAPI(config) {
    try {
      const response = await axios(config);

      return response;
    } catch (error) {
      console.error(error);
      console.error(error.response.status);
      return false;
    }
  },
  async putToAPI(config) {
    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      console.error(error);
      console.log(error.response.status);
      return false;
    }
  },
  async postToAPI(config) {
    try {
      const response = await axios(config);
      return response;
    } catch (error) {
      console.error(error.message, error.response.status);
      return false;
    }
  },
};
