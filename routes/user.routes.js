const userRoutes = require("express").Router();
const passport = require("passport");
const UserController = require("../controllers/user.controller");
const { jwtExist } = require("../middlewares/jwt");
const { body } = require("express-validator");

userRoutes.post(
  "/users",
  body("email").isEmail().normalizeEmail(),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Must be 6 characters long"),
  body("username").trim(),
  UserController.create
);

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
