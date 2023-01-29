const passport = require("passport");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

class UserController {
  static async create(req, res, next) {
    passport.authenticate(
      "create",
      {
        session: false,
      },
      function (err, user, info) {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.json({
            message: "User Already Exist",
            info: "Email or Username is already registered ",
          });
        }

        const payload = {
          _id: user._id,
          email: user.email,
        };

        const acc_token = jwt.sign(payload, process.env.JWT_SECERT, {
          expiresIn: "3d",
        });

        res.json({
          message: "User Created Successfully!",
          access_token: acc_token,
        });
      }
    )(req, res, next);
  }

  static async getUser(req, res, next) {
    const username = req.params.username;
    if (!username) {
      return res.status(400).json({
        message: "Username not provided!",
      });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: `User with username '${username}' not found!`,
      });
    }

    res.status(200).json({
      username: user.username,
      email: user.email,
      followers: user.followers,
      following: user.following,
    });

    next();
  }

  static async getFollowers(req, res, next) {
    let username = req.params.username;
    res.send(`LIST OF FOLLOWERS OF ${username}`);
    next();
  }

  static async getFollowing(req, res, next) {
    let username = req.params.username;
    res.send(`LIST OF FOLLOWING OF ${username}`);
    next();
  }

  static async follow(req, res, next) {
    const username = req.params.username;
    if (!username) {
      return res.status(400).json({
        message: "Username not provided!",
      });
    }

    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(400).json({
        message: `User with username '${username}' not found!`,
      });
    }

    const currentUser = req.user;

    // Check if user trying to follow himself
    if (currentUser.email === user.email) {
      return res.json({
        message: "You cannot follow yourself",
      });
    }

    // Check if user already followed that user
    let alreadyFollowing = false;
    currentUser.following.forEach((userId) => {
      if (userId.equals(user._id)) {
        alreadyFollowing = true;
      }
    });

    if (alreadyFollowing) {
      return res.json({
        message: "Already followed!",
      });
    }

    user.followers.push(currentUser._id);
    await user.save();

    currentUser.following.push(user._id);
    await currentUser.save();

    return res.json({
      message: `Following '${user.username}'`,
    });

    next();
  }

  static async unfollow(req, res, next) {
    let username = req.params.username;
    res.send(`UNFOLLOWED ${username}`);
    next();
  }
}

module.exports = UserController;
