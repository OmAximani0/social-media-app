const userRoutes = require("express").Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller");
const { jwtExist } = require("../middlewares/jwt");

userRoutes.post("/users", UserController.create);

userRoutes.get(
  "/users/:username",
  jwtExist,
  passport.authenticate("verify", { session: false }),
  UserController.getUser
);

userRoutes
  .route("/users/:username/follow")
  .post(
    jwtExist,
    passport.authenticate("verify", { session: false }),
    UserController.follow
  )
  .delete(
    jwtExist,
    passport.authenticate("verify", { session: false }),
    UserController.unfollow
  );

userRoutes.get(
  "/users/:username/followers",
  jwtExist,
  passport.authenticate("verify", { session: false }),
  UserController.getFollowers
);

userRoutes.get(
  "/users/:username/following",
  jwtExist,
  passport.authenticate("verify", { session: false }),
  UserController.getFollowing
);

module.exports = userRoutes;
