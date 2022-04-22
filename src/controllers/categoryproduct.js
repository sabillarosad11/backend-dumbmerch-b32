const { categoryProduct } = require("../../models");

exports.addCategoryProduct = async (req, res) => {
  try {
    await categoryProduct.create(req.body);

    res.send({
      status: "success",
      message: "Add category Product finished",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getCategoryProducts = async (req, res) => {
  try {
    const data = await categoryProduct.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};
