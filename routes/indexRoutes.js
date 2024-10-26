const { Router } = require("express");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

// Routes
indexRouter.get("/", indexController.showAllMessages);

// authRoutes
indexRouter.get("/signup", indexController.signUpUserGet);
indexRouter.post("/signup", indexController.signUpUserPost);

indexRouter.get("/login", indexController.logInUserGet);
indexRouter.post("/login", indexController.logInUserPost2);

indexRouter.get("/logout", indexController.logOutUser);
// authRoutes

module.exports = indexRouter;
