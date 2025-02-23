const express = require('express');
const cors = require('cors');
const userService = require('./services/userService');
const exerciseService = require('./services/exerciseService');
const app = express();

// Middleware
app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.post("/api/users", (req, res) => {
  const { username } = req.body;
  userService.createUser(username, res);
});

app.get("/api/users", (req, res) => {
  userService.getAllUsers(res);
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  exerciseService.createExercise(_id, description, duration, date, res);
});

app.get("/api/users/:_id/logs", (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  exerciseService.getExerciseLog(_id, from, to, limit, res);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

const listener = app.listen(process.env.PORT || 3001, () => {
  console.log('App is listening on port ' + listener.address().port);
});

