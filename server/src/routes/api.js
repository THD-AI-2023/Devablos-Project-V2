const express = require('express');
const router = express.Router();

/**
 * @swagger
 * /api/greet:
 *   get:
 *     description: Greet the user
 *     responses:
 *       200:
 *         description: Returns a greeting message
 */
router.get('/greet', function(req, res, next) {
  res.json({ message: 'Hello, welcome to the Devablos Project V2 API!' });
});

module.exports = router;
