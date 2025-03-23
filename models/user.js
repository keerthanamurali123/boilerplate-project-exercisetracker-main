const db = require('../database/database');

module.exports = {
  createUser: (username, callback) => {
    const checkQuery = "SELECT * FROM users WHERE username = ?";
    db.get(checkQuery, [username], (err, existingUser) => {
        if (err) return callback(err);
        if (existingUser) return callback(new Error("Username already exists"));

        const query = "INSERT INTO users (username) VALUES (?)";
        db.run(query, [username], function (err) {
            callback(err, this.lastID);
        });
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
