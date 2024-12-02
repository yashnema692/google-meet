const Room = require('../models/room');

// Example of joining a room in the backend
exports.joinRoom = async (req, res) => {
  const { roomId, userId, role } = req.body;

  if (!userId || !role) {
    return res.status(400).send('User ID and role are required');
  }

  try {
    let room = await Room.findOne({ roomId });

    if (!room) {
      room = new Room({ roomId, users: [] });
    }

    // Add the user to the room
    room.users.push({ userId, role });
    await room.save();

    res.status(200).send(room);
  } catch (error) {
    res.status(500).send('Error joining room');
  }
};
