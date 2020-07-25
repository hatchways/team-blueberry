// Import Axios
const axios = require("axios");

// Import reducers
// #NOTE I do not fully understand how to update the reducer. I know what is does, but not how to code its usage

// Handle all requests to API here
module.exports = {
  async getFromAPI(config) {
    try {
      // Logic to update reducer (Sent)
      const response = await axios(config);

      //Logic to update reducer (Success)
      return response;
    } catch (error) {
      // Logic to update reducer (Failure)

      console.error(error);
      console.error(error.response.status);
      return false;
    }
  },
  async putToAPI(config) {
    try {
      // Logic to update reducer (Sent)
      const response = await axios(config);

      // Logic to update reducer (Success)
      return response;
    } catch (error) {
      // Logic to update reducer (Failure)

      console.error(error);
      console.log(error.response.status);
      return false;
    }
  },
};
