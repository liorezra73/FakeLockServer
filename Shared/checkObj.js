const isObjFalse = obj => {
  return !obj || Object.entries(obj).length === 0;
};

module.exports = isObjFalse;
