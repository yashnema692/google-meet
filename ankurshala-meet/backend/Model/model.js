const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  role: { type: String, required: true },
});

const roomSchema = new mongoose.Schema({
  roomId: { type: String, required: true, unique: true },
  users: [userSchema],
});

module.exports = mongoose.model('Room', roomSchema);
