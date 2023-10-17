const router = require('express').Router();
const {verifyToken}  = require('../middleware/auth');
 
const {signUp,login, verifyOTP, resendOTP, forgotpassword,resetpassword ,getProfile, editProfile }=require("../controller/controller");
router.post("/signup",signUp)
router.post("/login",login);   
router.post("/verifyOTP",verifyOTP)
router.put("/resendOTP",resendOTP)
router.post("/forgotpassword",forgotpassword)
router.post("/resetpassword",resetpassword)
router.get("/getProfile",getProfile,verifyToken )
router.post("/editProfile", verifyToken,editProfile)
  
module.exports=router

