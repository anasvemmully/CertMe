const { JOISchema, validRefreshToken } = require("../controllers/tools");
// const UserToken = require("../models/UserToken");
// const AccessToken = require("../models/accessToken");
const User = require("../models/User");
// const jwt = require("jsonwebtoken");

const middleware = async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = {
  middleware,

  // middle,
  // tokenMiddleware,
};

// const tokenMiddleware = async (req, res, next) => {
//   const { refresh_token } = req.cookies;
//   try {
//     if (refresh_token) {
//       const refresh_token_decode = jwt.verify(
//         refresh_token,
//         process.env.REFRESH_PRIVATE_TOKEN_SECRET
//       );
//       if (refresh_token_decode) {
//         UserToken.findOne({ token: refresh_token }).then(async (t) => {
//           if (t) {
//             User.findOne({ email: refresh_token_decode.email }).then(
//               async (user) => {
//                 req.userid = user.userId;
//                 req.email = user.email;
//                 next();
//               }
//             );
//           } else {
//             console.log("Iam here too!");
//             validRefreshToken(refresh_token).then(({ message }) => {
//               res
//                 .clearCookie("refresh_token")
//                 .clearCookie("access_token")
//                 .status(205)
//                 .json({
//                   message: message,
//                 });
//             });
//           }
//         });
//       } else {
//         res.status(401).json({
//           message: "Invalid token",
//         });
//       }
//     } else {
//       console.log("Iam here!");
//       res
//         .clearCookie("refresh_token")
//         .clearCookie("access_token")
//         .status(205)
//         .json({
//           message: message,
//         });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({
//       message: "Invalid Token",
//     });
//   }
// };

// const validateTokens = async (refresh_token, access_token) => {
//   try {
//     console.log(refresh_token);
//     console.log(access_token);
//     console.log("validateTokens");
//     if (refresh_token && access_token) {
//       const refresh_token_decode = jwt.verify(
//         refresh_token,
//         process.env.REFRESH_PRIVATE_TOKEN_SECRET
//       );
//       const access_token_decode = jwt.verify(
//         access_token,
//         process.env.ACCESS_PRIVATE_TOKEN_SECRET
//       );

//       const user = await User.findOne({ email: refresh_token_decode.email });
//       if (user) {
//         AccessToken.findOne({ token: access_token })
//           .then((t) => {
//             if (!t) {
//               return { bool: false, user: user }; //not exist
//             } else {
//               UserToken.findOne({ token: refresh_token })
//                 .then((t) => {
//                   if (!t) {
//                     return { bool: false, user: user }; //not exist
//                   } else {
//                     if (
//                       access_token_decode?.email === refresh_token_decode?.email
//                     ) {
//                       return {
//                         bool: true,
//                         user,
//                       };
//                     } else {
//                       return {
//                         bool: false,
//                         user,
//                       };
//                     }
//                   }
//                 })
//                 .catch((err) => {
//                   return { bool: false, user: user }; //not exists
//                 });
//             }
//           })
//           .catch((err) => {
//             return { bool: false, user: user }; //not exists
//           });
//       }
//       return { bool: false, user: undefined };
//     } else {
//       return { bool: false, user: undefined };
//     }
//   } catch (error) {
//     res.status(401).json({
//       message: "Invalid token",
//     });
//   }
// };

// const middle = async (req, res, next) => {
//   console.log("middleware working");
//   try {
//     const { refresh_token, access_token } = req.cookies;

//     const { bool, user } = await validateTokens(
//       refresh_token,
//       access_token,
//       req
//     );

//     console.log("bool : " + bool);
//     console.log("user : " + user);
//     if (refresh_token && access_token && bool) {
//       const { error } = JOISchema.token.validate({
//         refreshtoken: refresh_token,
//       });
//       const { error1 } = JOISchema.token.validate({
//         refreshtoken: access_token,
//       });
//       if (error && error1) {
//         res.status(401).json({
//           message: error.details[0].message,
//         });
//       } else {
//         req.userid = user.userId;
//         req.email = user.email;
//         next();
//       }
//     }
//     res.status(401).json({
//       message: "Invalid Token",
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };
