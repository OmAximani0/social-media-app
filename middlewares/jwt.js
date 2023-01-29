function jwtExist(req, res, next) {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(400).json({
      message: "Authorization Failed",
      info: "Token not provided!",
    });
  }
  next();
}

module.exports.jwtExist = jwtExist