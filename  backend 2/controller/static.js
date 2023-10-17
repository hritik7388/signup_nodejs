const staticModel = require("../model/staticModel");
module.exports = {
  staticList: async (req, res) => {
    try {
      let staticUser = await staticModel.find({        
        status:"ACTIVE"
      });
      if (!staticUser) {
        return res.send({
          responseCode: 404,
          responseMessage: " Content does not Exist",
          responseResult: [],
        });
      } else {
        return res.send({
          responseCode: 200,
          responseMessage: "Found the Content  Successfully",
          responseResult: staticUser,
        });
      }
    } catch (error) {
      return res.send({
        responseCode: 501,
        responseMessage: "Something went Wrong",
        responseResult: error.message,
      });
    }
  },

  staticView: async (req, res) => {
    try {
      let staticUser = await staticModel.updateOne(
        { _id: req.body.id },
        { status: "ACTIVE" }
      );
      if (!staticUser) {
        return res
          .status(404)
          .json({ responseCode: 404, responseMessage: "Content Not Found" });
      } else {
        return res.send({
          responseCode: 200,
          responseMessage: "Found the Content  Successfully",
          responseResult: staticUser,
        });
      }
    } catch (error) {
      return res.send({
        responseCode: 501,
        responseMessage: "Something went Wrong",
        responseResult: error.message,
      });
    }
  },
  staticEdit: async (req, res) => {
    try {
      let staticUser = await staticModel.findOne({ _id: req.body._id });
      if (!staticUser) {
        return res
          .status(404)
          .json({ responseCode: 404, responseMessage: "Content Not Found" });
      } else {
        let user = await staticModel.findByIdAndUpdate(
          { _id: staticUser._id },
          { $set: { description: req.body.description } },
          { new: true }
        );
        if (user) {
          return res.send({
            responseCode: 200,
            responseMessage: "StaticUser  update the Content  Successfully ",
            responseResult: user,
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
};
