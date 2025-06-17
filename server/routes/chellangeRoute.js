// const express = require('express');
// const challengeController = require('../controllers/chellangeController');
// const router = express.Router();

// // יצירת אתגר שבועי חדש
// router.post('/create', challengeController.createChallenge);

// // קבלת כל האתגרים השבועיים (עם אפשרות לסינון)
// router.get('/', challengeController.getChallenges);

// // קבלת אתגר לפי מזהה
// router.get('/:id', challengeController.getChallengeById);

// router.get('/byUserId/:id', challengeController.getChallengeByUserId);

// // עדכון פרטי אתגר
// router.put('/:id', challengeController.updateChallenge);

// // מחיקת אתגר
// router.delete('/:id', challengeController.deleteChallenge);

// module.exports = router;
const express = require('express');
const router = express.Router();
const controller = require('../controllers/chellangeController');

// אתגרים שבועיים
router.get('/', controller.getAllChallenges); // כל האתגרים או עם סינון
router.post('/create', controller.createChallenge);
router.delete('/:id', controller.deleteChallenge);
router.get('/:challengeId/completions', controller.getChallengeCompletions); // כל מי שהשלים את האתגר

// השלמות
// router.get('/:challengeId/completions', controller.getChallengeCompletions); // כל מי שהשלים את האתגר
// router.get('/user/:userId', controller.getUserChallengeStatuses); // מה המשתמש השלים
router.post('/:challengeId/complete/:userId', controller.markCompleted);
router.delete('/:challengeId/complete/:userId', controller.unmarkCompleted);
// // אתגרים שהמשתמש השלים, אחרונים קודם
// router.get('/user/:userId/recent-completed', controller.getRecentCompletedChallenges);


module.exports = router;
