const mongoose=require("mongoose")
const schema = require("mongoose").Schema;
const staticSchema = new schema({
    type: {type: String,require:true},
    title: {type: String,require:true},
    description: {type: String,require:true},
    status: {type: String,default: "ACTIVE",},
  });
const staticModel = mongoose.model("static", staticSchema);
module.exports = staticModel;
const StaticContent = async () => {
    try {
      const staticUserModel = mongoose.model("static", staticSchema);
      const existingContent = await staticUserModel.findOne({ userType: { $in: ["ADMIN"] } });
  
      if (existingContent) {
        console.log("content already exists");
      } else {
        let staticUser1 = {
          status: "ACTIVE",
          type: "Privacy Policy",
          title: "Privacy Policy",
          description: "This is privacy policy",
        };
        let staticUser2 = {
          status: "ACTIVE",
          type: "Terms And Conditions",
          title: "Terms And Conditions",
          description: "This is terms and conditions",
        };
        let staticUser3 = {
          status: "ACTIVE",
          type: "Terms And Conditions",
          title: "Terms And Conditions",
          description: "This is terms and conditions",
        };
  
        const createdContent = await staticUserModel.create(staticUser1, staticUser2, staticUser3);
        console.log("static content created", createdContent);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  
  StaticContent();

  