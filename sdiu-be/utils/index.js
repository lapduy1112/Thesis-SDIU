const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

 const hashString = async (useValue) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(useValue, salt);
  return hashedPassword;
};

 const compareString = async (password, userPassword) => {
  const isMatch = await bcrypt.compare(password, userPassword);
  return isMatch;
};
module.exports = {hashString,compareString};