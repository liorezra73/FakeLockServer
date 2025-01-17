// const poolPromise = require("../db");
// const sql = require("mssql");

// const getUserById = async id => {
//   const pool = await poolPromise;
//   const user = await pool
//     .request()
//     .input("id", sql.Int, id)
//     .execute("GetUserById");
//   return user.recordset[0];
// };

// const getUsersByIds = async ids =>{
//   const pool = await poolPromise;
//   const user = await pool
//     .request()
//     .input("ids", sql.NVarChar, ids)
//     .execute("GetUsersByIds");
//   return user.recordset;
// }

// const isUsernameExist = async username => {
//   const pool = await poolPromise;
//   const user = await pool
//     .request()
//     .input("username", sql.VarChar, username)
//     .execute("GetUserByUsername");
//   return user.recordset.length > 0;
// };

// const getUserByUsername = async username => {
//   const pool = await poolPromise;
//   const user = await pool
//     .request()
//     .input("username", sql.VarChar, username)
//     .execute("GetUserByUsername");
//   return user.recordset[0];
// };

// const GetUsersByStartsWith = async startsWith => {
//   const pool = await poolPromise;
//   const result = await pool
//     .request()
//     .input("username", sql.VarChar, startsWith)
//     .execute("GetUsersByStartsWith");
//   if (result.recordset.length > 0) {
//     return result.recordset;
//   } else {
//     return [];
//   }
// };

// const createUser = async user => {
//   const pool = await poolPromise;
//   let res = await pool
//     .request()
//     .input("fullName", sql.VarChar, user.fullName)
//     .input("username", sql.VarChar, user.username)
//     .input("password", sql.VarChar, user.password)
//     .input("birthDate", sql.Date, user.birthDate)
//     .input("address", sql.VarChar, user.address)
//     .input("jobAddress", sql.VarChar, user.jobAddress)
//     .execute("CreateUser");
//   return res.recordset[0];
// };

const userRepository = (poolPromise, sql) => {
  return {
    getUserById: async (id) => {
      const pool = await poolPromise;
      const user = await pool
        .request()
        .input("id", sql.Int, id)
        .execute("GetUserById");
      return user.recordset[0];
    },

    getUsersByIds: async (ids) => {
      const pool = await poolPromise;
      const user = await pool
        .request()
        .input("ids", sql.NVarChar, ids)
        .execute("GetUsersByIds");
      return user.recordset;
    },

    isUsernameExist: async (username) => {
      const pool = await poolPromise;
      const user = await pool
        .request()
        .input("username", sql.VarChar, username)
        .execute("GetUserByUsername");
      return user.recordset.length > 0;
    },

    getUserByUsername: async (username) => {
      const pool = await poolPromise;
      const user = await pool
        .request()
        .input("username", sql.VarChar, username)
        .execute("GetUserByUsername");
      return user.recordset[0];
    },

    GetUsersByStartsWith: async (startsWith) => {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("username", sql.VarChar, startsWith)
        .execute("GetUsersByStartsWith");
      if (result.recordset.length > 0) {
        return result.recordset;
      } else {
        return [];
      }
    },

    createUser: async (user) => {
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
    },
  };
};

module.exports = userRepository

// module.exports = {
//   getUserById,
//   GetUsersByStartsWith,
//   createUser,
//   isUsernameExist,
//   getUserByUsername,
//   getUsersByIds,
// };
