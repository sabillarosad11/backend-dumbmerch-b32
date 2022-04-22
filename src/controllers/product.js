const { product, user, transaction, category, categoryProduct } = require("../../models");

exports.addProduct = async (req, res) => {
  try {

    let { categoryId } = req.body;

    if (categoryId) {
      categoryId = categoryId.split(",");
    }

    const data = req.body;

    data.image = req.file.filename;
    data.idUser = req.user.id;

    let newProduct = await product.create(data);

    if (categoryId) {
      const productCategoryData = categoryId.map((item) => {
        return { idProduct: newProduct.id, idCategory: parseInt(item) };
      });

      await categoryProduct.bulkCreate(productCategoryData);
    }

    let productData = await product.findOne({
      where: {
        id: newProduct.id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "image"],
          },
        },
        {
          model: category,
          as: "categories",
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
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    res.send({
      status: 'success',
      productData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};


exports.getProducts = async (req, res) => {
  try {
    let products = await product.findAll({
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },

        {
          model: transaction,
          as: "transactions",
          attributes: {
            exclude: ["createdAt", "updatedAt", "status"],
          },
        },

        {
          model: category,
          as: "categories",
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
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    const PATH = 'http://localhost:5003/uploads/';

    products = products.map((item) => {
      item.image = PATH + item.image;
      return item;
    });

    res.send({
      status: "success",
      data: {
          products,
      }
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;

    let data = await product.findOne({
      where: {
        id,
      },
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },

        {
          model: transaction,
          as: "transactions",
          attributes: {
            exclude: ["createdAt", "updatedAt", "status"],
          },
        },

        {
          model: category,
          as: "categories",
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

      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    data = JSON.parse(JSON.stringify(data));

    data = {
      ...data,
      image: process.env.PATH_FILE + data.image,
    };

    if (!data) {
      return res.send({
        error: {
          message: `Product with ID: ${id} not found `,
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

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    let { categoryId } = req.body;
    if (categoryId) {
      categoryId = categoryId.split(",");
    }

    const data = {
      name: req?.body?.name,
      desc: req?.body.desc,
      price: req?.body?.price,
      image: req?.file?.filename,
      qty: req?.body?.qty,
      idUser: req?.user?.id,
    };
    console.log(req.body);
    await product.update(data, {
      where: {
        id,
      },
    });

    if (categoryId) {
      const productCategoryData = categoryId.map((item) => {
        return { idProduct: newProduct.id, idCategory: parseInt(item) };
      });

      await categoryProduct.bulkCreate(productCategoryData);
    }

    res.send({
      status: "success",
      data: {
        id,
        data,
        image: req?.file?.filename,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};


exports.deleteProduct= async (req, res) => {
  try {
    const id = req.params.id;

    await product.destroy({
      where: {
        id,
      },
    });

    await categoryProduct.destroy({
      where: {
        idProduct: id,
      },
    });

    res.send({
      status: "success",
      message: `Delete product by ID: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};