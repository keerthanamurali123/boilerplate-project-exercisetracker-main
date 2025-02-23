const db = require('../database/database');

module.exports = {
  createExercise: (userId, description, duration, date, callback) => {
    const query = "INSERT INTO exercises (user_id, description, duration, date) VALUES (?, ?, ?, ?)";
    db.run(query, [userId, description, duration, date], function (err) {
      callback(err, this.lastID);
    });
  },

  getExercisesByUser: (userId, from, to, limit, callback) => {
    let query = "SELECT * FROM exercises WHERE user_id = ?";
    let params = [userId];

    if (from) query += " AND date >= ?";
    if (to) query += " AND date <= ?";
    if (limit) query += " LIMIT ?";

    db.all(query, [...params, from, to, limit], callback);
  },
};
