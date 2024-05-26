const express = require('express');
const router = express.Router();

router.get('/greet', function(req, res, next) {
  res.json({ message: 'Hello, welcome to the Devablos Project V2 API!' });
});

module.exports = router;
