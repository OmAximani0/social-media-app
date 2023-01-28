class UserController {
  static async create(req, res, next) {
    res.send("CREATED USER");
    next();
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
