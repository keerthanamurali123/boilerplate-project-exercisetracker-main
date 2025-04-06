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

    if (from) {
        query += " AND date >= ?";
        params.push(from);
    }
    if (to) {
        query += " AND date <= ?";
        params.push(to);
    }

    // First, get the count of total records in the range
    let countQuery = `SELECT COUNT(*) AS total FROM (${query})`;
    
    db.get(countQuery, params, (err, result) => {
        if (err) return callback(err);

        let totalCount = result.total; // This is the actual count of exercises in range

        query += " ORDER BY date ASC";
        if (limit) {
            query += " LIMIT ?";
            params.push(limit);
        }

        db.all(query, params, (err, rows) => {
            if (err) return callback(err);

            callback(null, { totalCount, rows });
        });
    });
},

};
