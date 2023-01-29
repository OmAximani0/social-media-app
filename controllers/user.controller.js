const passport = require("passport");
const jwt = require("jsonwebtoken");

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
    let username = req.params.username;
    res.send(`USER RECEIVED ${username}`);
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
    let username = req.params.username;
    res.send(`YOU FOLLOWED ${username}`);
    next();
  }
  static async unfollow(req, res, next) {
    let username = req.params.username;
    res.send(`UNFOLLOWED ${username}`);
    next();
  }
}

module.exports = UserController;
