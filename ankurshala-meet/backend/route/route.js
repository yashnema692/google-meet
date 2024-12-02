const express = require('express');
const router = express.Router();

router.post('/join', (req, res) => {
  res.send({ success: true });
});

router.post('/signal', (req, res) => {
  res.send({ success: true });
});

module.exports = router;
