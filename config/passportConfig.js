const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const pool = require("../config/dbConfig");

// 1) the basic Authentication callback
const verifyCallback = async (username, password, done) => {
  try {
    // 1 - get user from db
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = rows[0];
    // 2 - if no user found in db return 401 (unauthorized)
    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    // 3 - if user exists check the password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      // 4 - if no passwords match return 401 (unauthorized)
      return done(null, false, { message: "Incorrect password" });
    }
    // 5 - if user & password successfully authenticated then pass user to route
    console.log("successful authentication");
    return done(null, user);
  } catch (err) {
    // if any errors along the way (e.g., db issues)
    return done(err);
  }
};

// 2) create new local authentication strategy
const strategy = new LocalStrategy(verifyCallback);

// 3) connect strategy to the passport framework
passport.use(strategy);

// 4.1) serialize the user to the session
passport.serializeUser((user, done) => {
  console.log("serializing");
  done(null, user.id);
});

// 4.2) deserialize the user from the session
passport.deserializeUser(async (userId, done) => {
  console.log("de-serializing");
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
