const passport = require("passport");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");
const { validationResult } = require("express-validator");

class UserController {
  static async create(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
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

    const followersUser = await UserModel.find({
      _id: { $in: user.followers },
    });

    const followersUsername = () => {
      const userNames = [];
      followersUser.forEach((user) => userNames.push(user.username));
      return userNames;
    };

    res.status(200).json({
      username: user.username,
      followers: followersUsername(),
    });

    next();
  }

  static async getFollowing(req, res, next) {
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

    const followingUser = await UserModel.find({
      _id: { $in: user.following },
    });

    const followingUsername = () => {
      const userNames = [];
      followingUser.forEach((user) => userNames.push(user.username));
      return userNames;
    };

    res.status(200).json({
      username: user.username,
      following: followingUsername(),
    });

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
        message: "You cannot follow/unfollow yourself",
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

    res.json({
      message: `Following '${user.username}'`,
    });

    next();
  }

  static async unfollow(req, res, next) {
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
        message: "You cannot follow/unfollow yourself",
      });
    }

    let alreadyFollowing = false;
    currentUser.following.forEach((userId) => {
      if (userId.equals(user._id)) {
        alreadyFollowing = true;
      }
    });

    if (alreadyFollowing) {
      user.followers.pull(currentUser._id);
      await user.save();

      currentUser.following.pull(user._id);
      await currentUser.save();

      return res.json({
        message: `Unfollowed '${user.username}'`,
      });
    }

    res.json({
      message: `Already not following ${user.username}`,
    });

    next();
  }
}

module.exports = UserController;
