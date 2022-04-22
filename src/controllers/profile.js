const { profile, user } = require("../../models");

exports.addProfile = async (req, res) => {
  try {
    await profile.create(req.body);

    res.send({
      status: "success",
      message: "Add profile finished",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getProfiles = async (req, res) => {
  try {
    const profiles = await profile.findAll({
      include: {
        as: "user",
        model: user,
        attributes: {
          exclude: ["password", "createdAt", "updatedAt"],
        },
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', "idUser", "image"],
      }
    });

    res.send({
      status: "success",
      data: {
          profiles,
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
