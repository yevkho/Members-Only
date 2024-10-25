const { Router } = require("express");
const messagesController = require("../controllers/messagesController");
const { checkAuthentication } = require("../config/authenticationMlw");

const messagesRouter = Router();

// Routes
messagesRouter.get(
  "/new",
  checkAuthentication,
  messagesController.newMessageFormGet
);

messagesRouter.post(
  "/new",
  checkAuthentication,
  messagesController.newMessagePost
);

messagesRouter.post(
  "/:messageId/delete",
  checkAuthentication,
  messagesController.deleteMessagePost
);

module.exports = messagesRouter;
