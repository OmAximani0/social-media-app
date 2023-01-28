const userRoutes = require("express").Router();
const UserController = require("../controllers/user.controller");

userRoutes.post("/users", UserController.create);
userRoutes.get("/users/:username", UserController.getUser)
userRoutes.get("/users/:username/followers", UserController.getFollowers)
userRoutes.get("/users/:username/following", UserController.getFollowing)
userRoutes.post("/users/:username/follow", UserController.follow)
userRoutes.delete("/users/:username/follow", UserController.unfollow)

module.exports = userRoutes;
