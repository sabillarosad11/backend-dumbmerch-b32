const { user, profile, chat } = require("../../models");

const jwt = require("jsonwebtoken");

const { Op } = require("sequelize");

const connectUser = {};

const socketIo = (io) => {
  io.use((socket, next) => {
    if (socket.handshake.auth && socket.handshake.auth.token) {
      next();
    } else {
      next(new Error("Not Authorized"));
    }
  });  

  io.on("connection", (socket) => {
    console.log("client connect:", socket.id);

    const userToken = socket.handshake.auth.token;
    const tokenKey = process.env.SECRET_KEY;
    const userId = jwt.verify(userToken, tokenKey).id;

    connectUser[userId] = socket.id;
    

    socket.on("load admin contact", async () => {
      try {
        const contact = await user.findOne({
          include: [ {
            model: profile,
            as: "profile",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
          where: {
            status: "admin",
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        });

        socket.emit("admin contact", contact);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("load customer contact", async () => {
      try {
        const contact = await user.findAll({
          include: [
            {
              model: profile,
              as: "profile",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: chat,
              as: "recipientMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
            {
              model: chat,
              as: "senderMessage",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            },
          ],
          where: {
            status: "customer",
          },
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        });

        // customerContacts = JSON.parse(JSON.stringify(customerContacts));
        // customerContacts = customerContacts.map((item) => ({
        //   ...item,
        //   profile: {
        //     ...item.profile,
        //     image: item.profile?.image
        //       ? process.env.PATH_FILE + item.profile?.image
        //       : null,
        //   },
        // }));

        socket.emit("customer contact", contact);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("load messages", async (payload) => {
      try {
        const idRecipient = payload;
        const idSender = userId;
        console.log(idRecipient);
        console.log(idSender);

        const data = await chat.findAll({
          where: {
            idSender: {
              [Op.or]: [idRecipient, idSender],
            },
            idRecipient: {
              [Op.or]: [idRecipient, idSender],
            },
          },
          include: [
            {
              model: user,
              as: "recipient",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
            {
              model: user,
              as: "sender",
              attributes: {
                exclude: ["createdAt", "updatedAt", "password"],
              },
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt", "idRecipient", "idSender"],
          },
          order: [["createdAt", "ASC"]],
        });

        socket.emit("messages", data);
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("send message", async (payload) => {
      try {
        const idSender = userId;
        const { message, idRecipient } = payload;

        await chat.create({
          message,
          idRecipient,
          idSender,
        });

        io.to(socket.id)
          .to(connectUser[idRecipient])
          .emit("new message", idRecipient);
      } catch (error) {
        console.log(error);
      }
    });


    socket.on("disconnect", () => {
      console.log("client disconnect", socket.id);
      delete connectUser[userId];
    });

  });
};

module.exports = socketIo;
