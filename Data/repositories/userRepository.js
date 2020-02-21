const poolPromise = require("../db");
const sql = require("mssql/msnodesqlv8");
const generateError = require("../../errors/generateError");

const getUserById = async id => {
  const pool = await poolPromise;
  const user = await pool
    .request()
    .input("id", sql.Int, id)
    .execute("GetUserById");
  return user.recordset[0];
};

const isUsernameExist = async username => {
  const pool = await poolPromise;
  const user = await pool
    .request()
    .input("username", sql.VarChar, username)
    .execute("GetUserByUsername");
  return user.recordset.length > 0;
};

const getUserByUsername = async username => {
  const pool = await poolPromise;
  const user = await pool
    .request()
    .input("username", sql.VarChar, username)
    .execute("GetUserByUsername");
  return user.recordset[0];
};

const GetUsersByStartsWith = async startsWith => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("username", sql.VarChar, startsWith)
    .execute("GetUsersByStartsWith");
  if (result.recordset.length > 0) {
    return result.recordset;
  } else {
    throw generateError("NoUsersFound", "no users found in database");
  }
};

const createUser = async user => {
  const pool = await poolPromise;
  let res = await pool
    .request()
    .input("fullName", sql.VarChar, user.fullName)
    .input("username", sql.VarChar, user.username)
    .input("password", sql.VarChar, user.password)
    .input("birthDate", sql.Date, user.birthDate)
    .input("address", sql.VarChar, user.address)
    .input("jobAddress", sql.VarChar, user.jobAddress)
    .execute("CreateUser");
  return res.recordset[0];
};

const updateUser = async user => {
  const pool = await poolPromise;
  let res = await pool
    .request()
    .input("fullName", sql.VarChar, user.fullName)
    //  .input("id", sql.VarChar, user.username)
    .input("address", sql.VarChar, user.address)
    .input("jobAddress", sql.VarChar, user.jobAddress)
    .execute("UpdateUser");
  return res;
  return 0;
};

const changeUserPassword = async (username, password) => {
  const pool = await poolPromise;
  let res = await pool
    .request()
    .input("username", sql.VarChar, username)
    .input("password", sql.VarChar, password)
    .execute("ChangeUserPassword");
  return res;
};
module.exports = {
  getUserById,
  GetUsersByStartsWith,
  createUser,
  updateUser,
  changeUserPassword,
  isUsernameExist,
  getUserByUsername
};
