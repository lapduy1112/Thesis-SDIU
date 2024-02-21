const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const ApiError = require("../utils/ApiError");

exports.jwtAuth = (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    throw new ApiError(401, "Unauthorized");
  }
  const token = headerToken.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token is expired!");
    }
    throw new ApiError(401, "Unauthorized");
  }
};

exports.jwtAuthAdmin = async (req, res, next) => {
  const headerToken = req.headers.authorization;
  if (!headerToken) {
    throw new ApiError(401, "Unauthorized");
  }
  const token = headerToken.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }
  try {
    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(decode)
    const admin = await Admin.findById(decode.payload.admin._id);
    console.log(admin);
    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Token is expired!");
    }
    throw new ApiError(401, "Unauthorized");
  }
};
// exports.isAuthenticated = async (req, res, next) => {
//   try {
//     const token = req.cookies.token;
//     if (token) {
//       const decoded = jwt.verify(token, process.env.SECRET_KEY);
//       const { id } = decoded;
//       req.user = await User.findById(id).catch((error) => {
//         return next(new ApiError(404, "Not Found User"));
//       });
//       next();
//     } else {
//       throw new ApiError(401, "Please login to continue");
//     }
//   } catch (error) {
//     next(error);
//     if (error.name === "TokenExpiredError") {
//       throw new ApiError(401, "Token is expired!");
//     }
//     throw new ApiError(403, "Forbiden");
//   }
// };

// exports.checktoken = async(req,res,next) =>{
//     if (
//       req.url.toLowerCase().trim() == "/auth/login" ||
//       req.url.toLowerCase().trim() == "/auth/register"
//     ) {
//       next();
//       return;
//     }
//     const token = req.headers?.authorization?.split(" ")[1]
//     try {
//         const jwtObject = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//         const isExpired = Date.now() >= jwtObject.exp *1000;
//         if(isExpired){
//           res.status(400).json({ message: 'Token is expired' });
//         }
//         else{
//           next();
//         }

//     } catch(e){
//       res.status(400).json({message: e.message})
//     }

// }
