const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const pgSession = require("connect-pg-simple")(session);
const flash = require("connect-flash");

require("./config/passportConfig");
const pool = require("./config/dbConfig");

// routes
const indexRoutes = require("./routes/indexRoutes");
const messagesRoutes = require("./routes/messagesRoutes");

// set up express
const app = express();

//middleware
// Set view engine to EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Body parser middleware
app.use(express.urlencoded({ extended: false }));
// Session middleware
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: "snow cats",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10 * 60 * 1000 },
  })
);
app.use(flash()); // Enable flash messages
app.use(passport.session());

// Global variables middleware
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error"); // Add this line
  res.locals.success = req.flash("success"); // Add this line
  next();
});
// Serve static files (CSS, images, etc.)
app.use(express.static("public"));

// routers
app.use("/", indexRoutes);
app.use("/messages", messagesRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).send(err.message);
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
