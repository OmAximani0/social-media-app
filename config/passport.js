const passport = require("passport");
const LocalStratergy = require("passport-local");
const BearerStratergy = require("passport-http-bearer");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

passport.use(
  "create",
  new LocalStratergy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const username = req.body.username;
      const userExist = await UserModel.findOne({
        $or: [{ email }, { username }],
      });
      if (userExist) {
        return done(null, false);
      }

      const hashPassword = await bcrypt.hash(password, 12);

      const user = await UserModel.create({
        email,
        password: hashPassword,
        username,
      });
      return done(null, user);
    }
  )
);

passport.use(
  "verify",
  new BearerStratergy(async function (payload, done) {
    try {
      const decodedToken = jwt.verify(payload, process.env.JWT_SECERT);

      const user = await UserModel.findById({ _id: decodedToken._id });

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (error) {
      var user = {};

      if (error.message == "invalid token") {
        user.invalid = true;
        done(null, user);
      }

      done(error.message, false, {
        error: error.message,
      });
    }
  })
);

module.exports = passport;
