const userRepository = require("../Data/repositories/userRepository");
//const bcrypt = require("bcryptjs");
const generateToken = require("../Shared/generateToken");
const generateError = require("../errors/generateError");
const dbErrorHandling = require("../errors/dbErrorHandling");
const logger = require("../logger/logger");


const createUser = async newUser => {
  try {
    const isExisting = await userRepository.isUsernameExist(newUser.username);
    if (isExisting) {
      throw generateError(
        "UsernameExist",
        `Username ${newUser.username} already exists in database!`
      );
    }
    const res = await userRepository.createUser(newUser);
    const token = generateToken(res.Id);
    return token;
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

const getUsers = async () => {
  try {
    return await userRepository.getUsers();
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
  getUsers
};
