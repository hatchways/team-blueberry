const request = require("../utils/requestHandlers");
const axios = require("axios");

const newProject = async (project, dispatch) => {
  dispatch({ type: "UPDATE_USER_PROJECTS" });
  try {
    // const { data } = await axios({
    await axios({
      url: `/api/user/projects`,
      method: "POST",
      data: project.image,
      headers: { "Content-Type": "image/jpg" },
    });
    const { data } = await axios({
      method: "POST",
      url: "/api/user/projects",
      data: project,
      headers: { "Content-Type": "application/json" },
    });
    // console.log("Data: ", data);
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

const fetchProjects = async (userId) => {
  try {
    const { data } = await axios({
      method: "GET",
      url: "/api/user/projects",
      data: { userId },
    });
    return data.projects;
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = { newProject, deleteProject, fetchProjects };
