
const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/chellangeController');
const { authenticateToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/',authenticateToken,challengeController.getAllChallenges); 
router.patch('/:challengeId/completed',authenticateToken, challengeController.completeWeeklyChallenge);
router.post('/create',authenticateToken, requireRole('admin'), challengeController.createChallenge);
router.delete('/:id',authenticateToken, requireRole('admin'), challengeController.deleteChallenge);
router.get('/:challengeId/completions',authenticateToken, requireRole('admin'), challengeController.getChallengeCompletions);
router.patch('/:id',authenticateToken, requireRole('admin'), challengeController.updateChallenge);

module.exports = router;
