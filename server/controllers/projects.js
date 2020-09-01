const User = require("../models/user");
const { persistProjectImg } = require("../middleware/s3Handler");

const createProject = async (req, res) => {
  console.log("Project: ", req.body);
  console.log("TYPE: ", !req.body.title);
  const userId = req.user.id;
  if (!req.body.title) {
    const signedURL = await persistProjectImg(req);
    const newProject = {
      title: "req.body.title",
      link: "req.body.link",
      image: signedURL,
    };
    try {
      const user = await User.findById(userId);
      const projects = [...user.projects, newProject];
      const newUser = await User.findOneAndUpdate(
        { _id: userId },
        { projects: [...projects] },
        { new: true }
      );
      return res.status(201).send(newUser.toObject());
    } catch (e) {
      return res.status(500).send(e);
    }
  } else {
    try {
      const user = await User.findById(userId);
      const newProject = {
        title: req.body.title,
        link: req.body.link,
        image: user.projects[user.projects.length - 1].image,
      };
      await user.projects
        .id(user.projects[user.projects.length - 1]._id)
        .remove();
      const newUser = await User.findOneAndUpdate(
        { _id: userId },
        { projects: [...user.projects, newProject] },
        { new: true }
      );
      return res.status(201).send(newUser.toObject());
    } catch (e) {
      return res.status(500).send(e);
    }
  }
};

const deleteProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    await user.projects.id(req.body.projectId).remove();
    const newUser = await User.findOneAndUpdate(
      { _id: userId },
      { projects: [...user.projects] },
      { new: true }
    );
    return res.status(201).send(newUser.toObject());
  } catch (e) {
    return res.status(500).send(e);
  }
};

const fetchProjects = async (req, res) => {
  const { userId } = req.body;
  try {
    const foundUser = await User.findById(userId).select(
      "name position company avatar languages rating projects"
    );
    return res.status(200).send(foundUser);
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  createProject,
  deleteProject,
  fetchProjects,
};
