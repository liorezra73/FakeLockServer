const userRepository = require("../Data/repositories/userRepository");
//const bcrypt = require("bcryptjs");
const generateToken = require("../Shared/generateToken");
const isObjFalse = require("../Shared/checkObj");
const generateError = require("../errors/generateError");
const dbErrorHandling = require("../errors/dbErrorHandling");
const logger = require("../logger/logger");
const passwordService = require("./passwordService");

const loginFunc = async newLogin => {
  try {
    const user = await userRepository.getUserByUsername(newLogin.username);
    if (isObjFalse(user))
      throw generateError(
        "UserNotFound",
        `User with username "${newLogin.username}" not found!`
      );
    const isMatch = await passwordService.comparison(
      newLogin.password,
      user.Password
    );
    if (!isMatch)
      throw generateError(
        "PasswordInvalid",
        `The password "${newLogin.password}" for "${newLogin.username}" is incorrect`
      );
    const token = generateToken(user.Id);
    return token;
  } catch (err) {
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    switch (err.name) {
      case "UserNotFound":
        throw { ...err };
      case "PasswordInvalid":
        throw { ...err };
      default:
        logger.error(err);
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

module.exports = {
  loginFunc
};
