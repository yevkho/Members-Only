const pool = require("../config/dbConfig");

// 1) get all messages
async function getAllMessages() {
  try {
    const { rows } = await pool.query(
      "SELECT messages.id, title, content, timestamp, firstname FROM messages JOIN users ON messages.user_id = users.id"
    );
    return rows;
  } catch {
    throw err;
  }
}

// 2) delete message

async function deleteMessage(messageId) {
  await pool.query("DELETE FROM messages WHERE id = ($1)", [messageId]);
}

// 1) add new user
async function addUser(
  firstname,
  lastname,
  username,
  hashedPassword,
  membership,
  isAdmin
) {
  await pool.query(
    `INSERT INTO users (firstname, lastname, username, password, membership, admin) 
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [firstname, lastname, username, hashedPassword, membership, isAdmin]
  );
  console.log("User added to database.");
}

// 2) add new message
async function addMessage(title, content, userId) {
  await pool.query(
    `INSERT INTO messages(title, content, user_id) VALUES ($1, $2, $3)`,
    [title, content, userId]
  );
}

module.exports = { getAllMessages, deleteMessage, addUser, addMessage };
