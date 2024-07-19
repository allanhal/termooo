const express = require('express');
const { startGame, guessWord } = require('../controllers/gameController');
const router = express.Router();

router.post('/start', startGame);
router.use('/guess', guessWord);

module.exports = router;
