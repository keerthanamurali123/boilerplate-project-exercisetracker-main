const exerciseModel = require('../models/exercise');
const userModel = require('../models/user');
const errorMessages = require('../errorMessages/errorMessages');
const statusCodes = require('../statusCodes/statusCodes');
const db = require('../database/database');

module.exports = {
  createExercise: (userId, description, duration, date, res) => {
    if (!description || !duration) {
      return res.status(statusCodes.BAD_REQUEST).json({ error: errorMessages.ERROR_ADDING_EXERCISE });
    }

     // Validate duration 
    if (isNaN(duration) || duration <= 0) {
        return res.status(400).json({ error: "Duration must be a positive number" });
    }

    userModel.getUserById(userId, (err, user) => {
      if (err || !user) {
        return res.status(statusCodes.NOT_FOUND).json({ error: errorMessages.USER_NOT_FOUND });
      }

      const exerciseDate = date || new Date().toISOString().split("T")[0];
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/; 

    if (!dateRegex.test(exerciseDate)) {
        return res.status(400).json({ error: "Date must be in the format YYYY-MM-DD" });
    }
    exerciseModel.createExercise(userId, description, duration, exerciseDate, (err, lastID) => {
        if (err) {
          return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessages.ERROR_ADDING_EXERCISE });
        }

        res.status(statusCodes.CREATED).json({
          username: user.username,
          _id: userId,
          description,
          duration: parseInt(duration),
          date: exerciseDate,
        });
      });
    });
  },

  getExerciseLog: (userId, from, to, limit, res) => {
    db.get("SELECT username FROM users WHERE id = ?", [userId], (err, user) => {
      if (err || !user) {
        return res.status(statusCodes.NOT_FOUND).json({ error: errorMessages.USER_NOT_FOUND });
      }
  
      exerciseModel.getExercisesByUser(userId, from, to, limit, (err, rows) => {
        if (err) {
          return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessages.ERROR_RETRIEVING_LOGS });
        }
  
        const count = rows.length;
        const log = rows.map((row) => ({
          description: row.description,
          duration: row.duration,
          date: row.date,
        }));
  
        res.status(statusCodes.OK).json({
          _id: userId,
          username: user.username, 
          count,
          log,
        });
      });
    });
  }
  
};
