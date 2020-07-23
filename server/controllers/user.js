export const showUser = (req, res, next) => {
  // check for logged in user
  const userId = req?.user?.id;
  if (!userId)
    return res
      .status(401)
      .send("You are not authorized to access this resource");
  try {
    const user = User.findById(userId).select("-password").exec();
    return res.status(200).send({ ...user });
  } catch (e) {
    // TODO maybe handle exception if user is logged in but db does not return
    // consider security implications
    console.log(e);
    return res
      .status(401)
      .send("You are not authorized to access this resource");
  }
};
