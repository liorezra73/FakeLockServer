const userRepository = require("../Data/repositories/userRepository");
const tokenService = require("./tokenService");
const generateError = require("../errors/generateError");
const dbErrorHandling = require("../errors/dbErrorHandling");
const logger = require("../logger/logger");
const passwordService = require("./passwordService");

const createUser = async newUser => {
  try {
    const isExisting = await userRepository.isUsernameExist(newUser.username);
    if (isExisting) {
      throw generateError(
        "UsernameExist",
        `Username ${newUser.username} already exists in database!`
      );
    }
    newUser.password = await passwordService.encryption(newUser.password);
    
    const res = await userRepository.createUser(newUser);
    return res;
  } catch (err) {
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    switch (err.name) {
      case "UsernameExist":
        throw { ...err };
      default:
        logger.error(err);
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

const GetUsersByStartsWith = async (startsWith) => {
  try {
    return await userRepository.GetUsersByStartsWith(startsWith);
  } catch (err) {
    const dbError = dbErrorHandling(err);
    if (dbError) throw dbError;
    switch (err.name) {
      case "NoUsersFound":
        throw { ...err };
      default:
        logger.error(err);
        throw generateError("ServerError", "Something went wrong");
    }
  }
};

module.exports = {
  createUser,
  GetUsersByStartsWith
};
