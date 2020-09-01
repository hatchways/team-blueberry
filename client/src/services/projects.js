const request = require("../utils/requestHandlers");
const axios = require("axios");

const newProject = async (project, dispatch) => {
  dispatch({ type: "UPDATE_USER_PROJECTS" });
  try {
    const { data } = await axios({
      method: "POST",
      url: "/api/user/projects",
      data: project,
    });
    console.log("Data: ", data);
    dispatch({
      type: "UPDATE_USER_PROJECTS_SUCCESS",
      user: data,
    });
  } catch (e) {
    dispatch({ type: "UPDATE_USER_PROJECTS_ERROR", error: { ...e } });
    console.log(e);
  }
};

const deleteProject = async (projectId, dispatch) => {
  dispatch({ type: "UPDATE_USER_PROJECTS" });
  try {
    const { data } = await axios({
      method: "DELETE",
      url: "/api/user/projects",
      data: { projectId },
    });
    dispatch({
      type: "UPDATE_USER_PROJECTS_SUCCESS",
      user: data,
    });
  } catch (e) {
    dispatch({ type: "UPDATE_USER_PROJECTS_ERROR", error: { ...e } });
    console.log(e);
  }
};
module.exports = { newProject, deleteProject };
