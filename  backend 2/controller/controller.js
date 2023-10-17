const { response } = require("express");
const userModel = require("../model/user");
const common = require("../helper/common");
const text = require("express");
const bcrypt = require("bcrypt");
const generateOTP = require("../helper/common.js");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const cloudinary= require('cloudinary').v2; 
cloud_name= "dpirdvvnh", 
api_key='your_api651862422399226_key', 
api_secret=  "FyECdxQv6EVu4BiF6mqAZyKkMSXwnZAKsBTwJxzIy9L0EDurnRCG0"
const secretKey = "secretkey";

module.exports = {
  signUp: async (req, res) => {
    try {
      const { password, cpassword } = req.body;
      let userData = await userModel.findOne({ email: req.body.email ,status:"ACTIVE",Usertype:"USER"});

      if (userData) {
        return res.status(409).json({
          responseCode: 409,
          responseMessage: "User already exists.",
          responseResult: [],
        });
      } else {
        if (password !== cpassword) {
          return res.send({
            responseCode: 401,
            responseMessage: "Password and Confirm Password not matched",
          });
        } else {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);
          const generatedOTP = generateOTP.generateOTP();
          const otpExpiration = new Date().getTime() + 3600000;
          let subject = "OTP Verification for signup";
          let text = `your OTP is:${generatedOTP}`;
          await common.sendMailing(req.body.email, subject, text);
          const obj = await userModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            cpassword: cpassword,
            number: req.body.number,
            otp: generatedOTP,
            otpExpiration: otpExpiration,
          }).save();
          return res.status(200).json({
            responseCode: 200,
            responseMessage: "User created successfully.",
            responseResult: obj,
          });
        }
      }
    } catch (error) {
      return res.send({
        responseCode: 501,
        responseMessage: "Something went wrong",
        responseResult: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { password, email } = req.body;
      if (email && password) {
        const userData = await userModel.findOne({ email: email,status:"ACTIVE",Usertype:"USER" });
        if (userData) {
          const pass = bcrypt.compareSync(password, userData.password);

          if (pass == true) {
            if (userData.otpVerification == true) {
              const token = jwt.sign(
                { userId: userData._id, email: req.body.email },
                secretKey,
                { expiresIn: "1h" }
              );

              return res.status(200).json({
                responseCode: 200,
                responseMessage: "User login successfully.",
                responseResult: { userData, token: token },
              });
            }
          } else {
            return res.status(403).json({
              responseCode: "403",
              responseMessage: "Invalid Password",
              responseResult: [],
            });
          }
        } else {
          return res.status(404).json({
            responseCode: "404",
            responseMessage: "Email not found",
            responseResult: userData,
          });
        }
      } else {
        return res.status(406).json({
          responseCode: "406",
          responseMessage: "Please enter all fields.",
        });
      }
    } catch (error) {
      console.log("error provide", error);
      return res.status(501).json({
        responseCode: 501,
        responseMessage: "Internal server error.",
        responseResult: error.message,
      });
    }
  },
  verifyOTP: async (req, res) => {
    try {
      const userData = await userModel.findOne({ email: req.body.email,status:"ACTIVE",Usertype:"USER" });
      if (!userData) {
        return res.status(404).json({
          responseCode: 404,
          responseMessage: "user not found",
          responseResult: [],
        });
      } else {
        if (req.body.otp == userData.otp) {
          if (new Date().getTime() < userData.otpExpiration) {
            const updateData = await userModel.findByIdAndUpdate(
              { _id: userData._id },
              { $set: { otpVerification: true, otp: null } },
              { new: true }
            );
            if (updateData) {
              return res.status(200).json({
                responseCode: 200,
                responseMessage: "verified successful",
                responseResult: updateData,
              });
            }
          } else {
            return res.status(410).json({
              responseCode: 410,
              responseMessage: "Otp Expired",
            });
          }
        } else {
          return res.status(404).json({
            responseCode: 404,
            responseMessage: "invalid otp",
          });
        }
      }
    } catch (error) {
      return res.send({
        responseCode: 501,
        responseMessage: "something went wrong",
        responseResult: error.message,
      });
    }
  },
  resendOTP: async (req, res) => {
    try {
      const { email } = req.body;
      const userData = await userModel.findOne({ email: email,status:"ACTIVE",Usertype:"USER" });

      if (!userData) {
        return res.status(404).json({
          responseCode: 404,
          responseMessage: "User not found.",
          responseResult: [],
        });
      } else {
        const generatedOTP = common.generateOTP();
        const otpExpiration = new Date().getTime() + 3600000;
        let subject = `OTP for Resend`;
        let text = `your resend OTP is :${generatedOTP}`;
        await common.sendMailing(email, subject, text);
        const resend = await userModel.findByIdAndUpdate(
          { _id: userData._id },
          {
            $set: {
              otp: generatedOTP,
              otpExpiration: otpExpiration,
            },
          }
        );
        if (resend) {
          return res.send({
            responseCode: 200,
            responseMessage: "Resend OTP successfully",
            responseResult: generatedOTP,
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        responseCode: 500,
        responseMessage: "Internal server error.",
        responseResult: [],
      });
    }
  },
  forgotpassword: async (req, res) => {
    try {
      const { email } = req.body;

      const userData = await userModel.findOne({ email:email });

      if (!userData) {
        return res.status(404).json({
          responseCode: 404,
          responseMessage: "User not found with this email address.",
          responseResult: [],
        });
      } else {
        const generatedOTP = common.generateOTP();
        const otpExpiration = new Date().getTime() + 3600000;

        let subject = `Forgot Password`;
        const text = `forgetPassword otp is:${generatedOTP}`;
        await common.sendMailing(email, subject, text);
        const forget = await userModel.findByIdAndUpdate(
          { _id: userData._id },
          {
            $set: {
              otp: generatedOTP,
              otpExpiration: otpExpiration,
            },
          }
        );
        if (forget) {
          return res.send({
            responseCode: 200,
            responseMessage: "send  OTP successfully",
            responseResult: generatedOTP,
          });
        }
      }
    } catch (error) {
      console.log("error provide", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  resetpassword: async (req, res) => {
    try {
      const { email, newPassword, cpassword, generatedOTP } = req.body;
      const userData = await userModel.findOne({ email: email });
      if (!userData) {
        return res.send({
          responseCode: 404,
          responseMessage: "user not found",
        });
      } else {
        const currentTime = Date.now();
        if (userData.generatedOTP == generatedOTP) {
          const otpExpiration = userData.otpExpiration;
          if (currentTime <= otpExpiration) {
            if (newPassword === cpassword) {
              const hashnewPassword = bcrypt.hashSync(newPassword);
              let userUpdate = await userModel.findByIdAndUpdate(
                { _id: userData._id },
                { $set: { password: hashnewPassword, otpVerification: true } },
                { new: true }
              );
              return res.send({
                responseCode: 200,
                responseMessage: "Password Reset Successfully",
                responseResult: userUpdate,
              });
            }
          } else {
            return res.send({
              responseCode: 406,
              responseMessage: "Otp expired",
            });
          }
        } else {
          return res.send({ responseCode: 406, responseMessage: "wrong4 otp" });
        }
      }
    } catch (error) {
      return res.send({
        responseCode: 500,
        responseMessage: "something went wrong",
        responseResult: error.massage,
      });
    }
  },  
  getProfile: async (req, res) => {
    try {
      const userId = req.body._id;   
      const userData = await userModel.findById(userId);
      if (!userData) {
        return res.status(404).json({responseCode: 404,responseMessage: "User not found",responseResult: [],});
      }    
      return res.status(200).json({
        responseCode: 200,
        responseMessage: "User found",
        responseResult: userData,
      });  
    } catch (error) {       
      return res.status(500).json({
        responseCode: 500,
        responseMessage: "Internal server error",
        responseResult: error.message});
    }
  },  
  editProfile: async (req, res) => {
    try {
      const user = await userModel.findOne({ _id: req.userId });
      if (!user) {
        return res.status(403).json({ message: "User Not Found" });
      } else {
        let userUpdate = await userModel.findByIdAndUpdate(
          { _id: user._id },
          {
            $set: {
              name: req.body.name,
              number: req.body.number,
              state: req.body.state,
            },
          },
          { new: true }
        );
        if (userUpdate) {
          return res.send({
            responseCode: 200,
            responseMessage: "user  update the his profile  Successfully ",
            responseResult: userUpdate,
          });
        }
      }
    } catch (error) {
      return res.send({
        responseCode: 501,
        responseMessage: "Something went Wrong",
        responseResult: error.message,
      });
    }
  }, 
};
