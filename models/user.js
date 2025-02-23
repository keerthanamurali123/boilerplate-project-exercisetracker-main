const db = require('../database/database');

module.exports = {
  createUser: (username, callback) => {
    const query = "INSERT INTO users (username) VALUES (?)";
    db.run(query, [username], function (err) {
      callback(err, this.lastID);
    });
  },

  getAllUsers: (callback) => {
    const query = "SELECT * FROM users";
    db.all(query, [], callback);
  },

  getUserById: (id, callback) => {
    const query = "SELECT * FROM users WHERE id = ?";
    db.get(query, [id], callback);
  },
};
