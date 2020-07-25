import axios from "axios";

//Handle all requests to API here
module.exports = {
  async getFromAPI(config) {
    try {
      //Logic to update reducer
      const response = await axios.get(config);
    } catch (error) {
      //Logic to update reducer
      console.error(error);
    }
    return response;
    //Logic to update reducer
  },
  async putToAPI(config) {
    try {
      //Logic to update reducer
      const response = await axios.put(config);
    } catch (error) {
      //Logic to update reducer
      console.error(error);
    }
    return response;
    //Logic to update reducer
  },
};
