const messageModel = require("../model/messageModel");

//addMessage function to add a message to the database
module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data)
      return res.json({ message: "Message added successfully", status: true });
    return res.json({
      message: "Failed to add message to the database",
      status: true,
    });
  } catch (ex) {
    next(ex);
  }
};
// getAllMessage function to get all messages between two users
module.exports.getAllMessage = async (req, res) => {
  try {
    const { from, to } = req.body;
    const messages = await messageModel
      .find({
        users: { $all: [from, to] },
      })
      .sort({ updateAt: 1 });
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    return res.json(projectMessages);
  } catch (ex) {
    next(ex);
  }
};
