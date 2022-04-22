const { category, product, categoryProduct } = require("../../models");

exports.addCategory = async (req, res) => {
  try {
    await category.create(req.body);

    res.send({
      status: "success",
      message: "Add category finished",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const data = await category.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
      include: [
        {
          model: product,
          as: "products",
          through: {
            model: categoryProduct,
            as: "bridge",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
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

exports.getCategory = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await category.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (!data) {
      return res.send({
        error: {
          message: `Category by ID: ${id} not found `,
        },
      });
    }

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

exports.updateCategory = async (req, res) => {
  try {
    const id = req.params.id;

    await category.update(req.body, {
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Update category ID: ${id} finished`,
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;

    await category.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Delete category by ID: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};
