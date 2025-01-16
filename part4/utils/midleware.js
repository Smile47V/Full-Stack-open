const User = require("../models/user");
const jwt = require("jsonwebtoken");
const logger = require("./logger");

const getTokenFrom = (request, response, next) => {
  const authorization = request.get("authorization");

  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
    logger.info(request.token);
  } else {
    request.token = null;
    logger.info("wrong token");
  }

  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  try {
    const user = await User.findById(decodedToken.id);

    if (!user) {
      return response.status(404).json({ error: "unknown user" });
    }
    request.user = user.name;
    next();
  } catch (err) {
    logger.error(err);
    next();
  }
};

module.exports = {
  getTokenFrom,
  userExtractor,
};
