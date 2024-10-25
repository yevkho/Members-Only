const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const db = require("../db/queries");
const passport = require("passport");

// 1 show all content
const showAllMessages = async (req, res) => {
  try {
    const messages = await db.getAllMessages();
    console.log(messages);

    console.log(res.locals);

    res.render("index.ejs", { messages });
  } catch (err) {
    next(err); // Pass the error to Express error-handling middleware
  }
};

// 2 sign up GET
const signUpUserGet = (req, res) => {
  res.render("signUpForm");
};

// 3 sign up POST
const validateSignUp = [
  body("firstname")
    .trim()
    .isAlpha()
    .withMessage(`First name must only contain letters`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`First name must be between 1 and 20 characters.`),
  body("lastname")
    .trim()
    .isAlpha()
    .withMessage(`Last name must only contain letters`)
    .isLength({ min: 1, max: 20 })
    .withMessage(`Last name must be between 1 and 20 characters.`),
  body("username")
    .trim()
    .isEmail()
    .withMessage("Username must be a valid e-mail address"),
  body("password")
    .isLength({ min: 6, max: 10 })
    .withMessage(`Password must be between 6 and 10 characters.`),
  body("repeatpassword")
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("passwords must match."),
  body("membercode")
    .optional({ values: "falsy" })
    .equals("007m")
    .withMessage(`Wrong Member Code`),
];

const signUpUserPost = [
  validateSignUp,
  async (req, res, next) => {
    // data validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("signUpForm", {
        errors: errors.array(),
      });
    }
    // if successfully validated route
    console.log(req.body);
    const { firstname, lastname, username, password, membercode, admin } =
      req.body;

    try {
      // async hashing of password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);

      // Determine membership status
      const membership = membercode.trim() !== ""; // Set to true if the code is valid

      // Determine admin status
      const isAdmin = admin === "true"; // true if the checkbox is checked

      // add new user to users database
      await db.addUser(
        firstname,
        lastname,
        username,
        hashedPassword,
        membership,
        isAdmin
      );
      // redirect upon success
      res.redirect("/");
    } catch {
      console.error(err); // Log the error for debugging
      return next(err);
    }
  },
];

// 4 log in GET
const logInUserGet = (req, res) => {
  res.render("logInForm", { username: "" });
};

// 4 log in POST
// simplified (no persistance on username)
const logInUserPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true, // Enable flash messages
});
// persistance on username
const logInUserPost2 = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed
      return res.status(400).render("logInForm", {
        error: [info.message], // Pass error messages
        username: req.body.username, // Pass the entered username back to the template
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

// 5 log out
const logOutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

module.exports = {
  showAllMessages,
  signUpUserGet,
  signUpUserPost,
  logInUserGet,
  logInUserPost,
  logInUserPost2,
  logOutUser,
};
