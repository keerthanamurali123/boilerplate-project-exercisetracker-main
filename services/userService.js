const userModel = require('../models/user');
const errorMessages = require('../errorMessages/errorMessages');
const statusCodes = require('../statusCodes/statusCodes');

module.exports = {
  createUser: (username, res) => {
    if (!username || typeof username !== "string" || username.trim() === "") {
      return res.status(statusCodes.BAD_REQUEST).json({ error: errorMessages.USERNAME_REQUIRED });
  }

  const sanitizedUsername = username.trim(); 

    userModel.createUser(sanitizedUsername, (err, lastID) => {
        if (err) {
            if (err.message === "Username already exists") {
                return res.status(statusCodes.BAD_REQUEST).json({ error: "Username must be unique" });
            }
            return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessages.ERROR_CREATING_USER });
        }
        res.status(statusCodes.CREATED).json({ username, _id: lastID });
    });
},

  getAllUsers: (res) => {
    userModel.getAllUsers((err, rows) => {
      if (err) {
        return res.status(statusCodes.INTERNAL_SERVER_ERROR).json({ error: errorMessages.ERROR_RETRIEVING_USERS });
      }
      res.status(statusCodes.OK).json(rows);
    });
  },

  getUserById: (id, res) => {
    userModel.getUserById(id, (err, user) => {
      if (err || !user) {
        return res.status(statusCodes.NOT_FOUND).json({ error: errorMessages.USER_NOT_FOUND });
      }
      res.status(statusCodes.OK).json(user);
    });
  },
};
