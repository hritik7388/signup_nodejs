const jwt = require("jsonwebtoken");
const userModel = require("../model/user");
const secretKey = "secretkey";

module.exports = {
 
  verifyToken:  (req, res, next) => {
    try {
      if (req.headers.token) {
        
        console.log("========>10")
        console.log(req.headers.token) 
        jwt.verify(req.headers.token, secretKey, async (error, decoded) => {
          console.log(decoded)
          if (error) {
            if (error.name === "TokenExpiredError") {
              return res.status(440).json({
                responseCode: 440,
                responseMessage: "Session expired, please log in again",
                responseResult: error,
              });
            } else {
              return res.status(440).json({
                responseCode: 440,
                responseMessage: "Unauthorized person",
                responseResult: error,
              });
            }
          } else {
            console.log("=========>22",decoded)
            userModel.findOne({ _id: decoded._id }),(error,decoded) => {
               
            
              if (error) {
                return next("error");
              } else if (!user) {
                return res.status(440).json({responseCode: 440,responseMessage: "User not found",
                  responseResult: [],
                });
              } else {
                if (user.status === "BLOCK") {
                  return res.status(440).json({
                    responseCode: 440,
                    responseMessage: "You have been blocked by admin",
                    responseResult: [],
                  });
                } else if (user.status === "DELETE") {
                  return res.status(402).json({
                    responseCode: 402,
                    responseMessage: "Your account has been deleted",
                    responseResult: [],
                  });
                } else {
                  req.body._id = decoded._id;
                  next();
                }
              }
            }
            res.status(200).json({message:"success", })
          }
        });
      } else {
        return res.status(409).json({
          responseCode: 409,
          responseMessage: "No token found",
          responseResult: [],
        });
      }
    } catch (error) {
      return res.status(500).json({
        responseCode: 500,
        responseMessage: "Internal server error",
        responseResult: [],
      });
    }
  },
  
};
