const db = require("../db/queries");

// 1
const newMessageFormGet = (req, res) => {
  res.render("newMessageForm.ejs");
};

// 2
const newMessagePost = async (req, res) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  console.log(title, content, userId);

  await db.addMessage(title, content, userId);
  res.redirect("/");
};

// 3
const deleteMessagePost = async (req, res) => {
  const { messageId } = req.params;
  console.log(messageId);

  await db.deleteMessage(messageId);
  res.redirect("/");
};

module.exports = { newMessageFormGet, newMessagePost, deleteMessagePost };
