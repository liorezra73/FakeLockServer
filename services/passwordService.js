// const bcrypt = require("bcryptjs");
const saltRounds = 10;

// const encryption = async password => {
//   return await bcrypt.hash(password, saltRounds);
// };

// const comparison = async (password, hash) => {
//   return await bcrypt.compare(password, hash);
// };

const passwordService = (bcrypt) => {
  return {
    encryption: async (password) => {
      return await bcrypt.hash(password, saltRounds);
    },

    comparison: async (password, hash) => {
      return await bcrypt.compare(password, hash);
    },
  };
};
module.exports = passwordService;
// module.exports = { encryption, comparison };
