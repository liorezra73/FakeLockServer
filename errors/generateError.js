const generateError = (name, message) => {
  return { name, message };
};
// const generateError = () => {
//   return (name, message) => {
//     return { name, message };
//   };
// };
module.exports = generateError;
