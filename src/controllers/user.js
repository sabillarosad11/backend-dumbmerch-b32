const { user, profile, product, transaction } = require('../../models');


exports.addUsers = async (req, res) => {
    try {
        await user.create(req.body)

        res.send({
            status: 'success',
            message: 'Add user finished'
        });
    } catch (error) {
        console.log(error)
        res.send({
            status: 'failed',
            message: 'Server error'
        })
    }
    
}


exports.getUsers = async (req, res) => {
  try {
    const data = await user.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: profile,
          as: "profile",
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser"],
          },
        },

        {
          model: product,
          as: "products",
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser"],
          },
        },

        {
          model: transaction,
          as: "buyerTransactions",
          attributes: {
            exclude: ["createdAt", "updatedAt", "status", "idBuyer"],
          },
        },

        {
          model: transaction,
          as: "sellerTransactions",
          attributes: {
            exclude: ["createdAt", "updatedAt", "status", "idSeller"],
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


exports.getUser = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await user.findOne({

            where: {
                id,
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
          },
        });

        if (!data) {
            return res.send({
                error: {
                    message: `Account with ID: ${id} not found `
                },
            })
        }

        res.send({
            status: 'success',
            data,
        })
    } catch (error) {
        console.log(error);
        res.send({
          status: "failed",
          message: "Server error",
        });
    }
}


exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;

    await user.update(req.body, {
      where: {
        id,
      },
    });


    res.send({
      status: "success",
      message: `Update user ID: ${id} finished`,
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


exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    await user.destroy({
        where: {
            id
        }
    });

    res.send({
      status: "success",
      message: `Delete user ID: ${id} user finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

