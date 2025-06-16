// const challengeService = require('../services/challengeService');

// // יצירת אתגר שבועי חדש
// exports.createChallenge = async (req, res) => {
//     try {
//         const challengeData = req.body;
//         const newChallenge = await challengeService.createChallenge(challengeData);
//         res.status(201).json(newChallenge);
//     } catch (error) {
//         res.status(500).json({ message: 'שגיאה ביצירת אתגר', error: error.message });
//     }
// };

// // קבלת כל האתגרים השבועיים (עם אפשרות לסינון)
// exports.getChallenges = async (req, res) => {
//     try {
//         const { week, ...otherFilters } = req.query;
//         console.log("otherFilters", otherFilters);
//         let filters = { ...otherFilters };

//         if (week) {
//             const weekFilter = addWeekFilter({ week });
//             filters = { ...filters, ...weekFilter };
//         }

//         const challenges = Object.keys(filters).length === 0
//             ? await challengeService.getAllChallenges()
//             : await challengeService.searchChallenges(filters);

//         res.status(200).json(challenges);
//     } catch (error) {
//         res.status(500).json({ message: 'שגיאה בקבלת אתגרים', error: error.message });
//     }
// };

// // פונקציה פנימית לבניית פילטר שבועי לפי פרמטר week
// function addWeekFilter(query) {
//     const inputDate = new Date(query.week);
//     if (isNaN(inputDate)) return {};

//     const dayOfWeek = inputDate.getDay();
//     const diffToSunday = (dayOfWeek + 6) % 7;
//     const startOfWeek = new Date(inputDate);
//     startOfWeek.setDate(inputDate.getDate() - diffToSunday);
//     startOfWeek.setHours(0, 0, 0, 0);

//     const endOfWeek = new Date(startOfWeek);
//     endOfWeek.setDate(startOfWeek.getDate() + 6);
//     endOfWeek.setHours(23, 59, 59, 999);

//     return {
//         challengeDate: {
//             $gte: startOfWeek,
//             $lte: endOfWeek
//         }
//     };
// }

// // קבלת אתגר לפי מזהה
// exports.getChallengeById = async (req, res) => {
//     try {
//         const challenge = await challengeService.getChallengeById(req.params.id);
//         if (!challenge) {
//             return res.status(404).json({ message: 'האתגר לא נמצא.' });
//         }
//         res.json(challenge);
//     } catch (error) {
//         res.status(500).json({ message: 'שגיאה בקבלת אתגר', error: error.message });
//     }
// };

// // קבלת אתגרים לפי מזהה משתמש
// exports.getChallengeByUserId = async (req, res) => {
//     try {
//         const challenges = await challengeService.getChallengeByUserId(req.params.id);
//         if (!challenges || challenges.length === 0) {
//             return res.status(404).json({ message: 'לא נמצאו אתגרים למשתמש.' });
//         }
//         res.json(challenges);
//     } catch (error) {
//         res.status(500).json({ message: 'שגיאה בקבלת אתגרים למשתמש', error: error.message });
//     }
// };

// // עדכון פרטי אתגר
// exports.updateChallenge = async (req, res) => {
//     try {
//         const updatedChallenge = await challengeService.updateChallenge(req.params.id, req.body);
//         if (!updatedChallenge) {
//             return res.status(404).json({ message: 'האתגר לא נמצא.' });
//         }
//         res.json(updatedChallenge);
//     } catch (error) {
//         res.status(500).json({ message: 'שגיאה בעדכון אתגר', error: error.message });
//     }
// };

// // מחיקת אתגר
// exports.deleteChallenge = async (req, res) => {
//     try {
//         const deleted = await challengeService.deleteChallenge(req.params.id);
//         if (!deleted) {
//             return res.status(404).json({ message: 'האתגר לא נמצא.' });
//         }
//         res.json({ message: 'האתגר נמחק בהצלחה.' });
//     } catch (error) {
//         res.status(500).json({ message: 'שגיאה במחיקת אתגר', error: error.message });
//     }
// };
const challengeService = require('../services/challengeService');
const userService = require('../services/userService');
exports.getAllChallenges = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20; // ברירת מחדל
        const offset = parseInt(req.query.offset) || 0;

        const result = await challengeService.getAllChallenges(limit, offset);
        console.log(result);
        res.json(result);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

exports.createChallenge = async (req, res) => {
    try {
        const result = await challengeService.createChallenge(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getRecentCompletedChallenges = async (req, res) => {
    try {
        const userId = req.params.userId;
        const limit = req.query.limit || 10; // אפשר לשלוח limit מהקליינט
        const challenges = await challengeService.getRecentCompletedChallenges(userId, limit);
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.didUserCompleteCurrentChallenge = async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await challengeService.didUserCompleteCurrentChallenge(userId);
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

exports.deleteChallenge = async (req, res) => {
    try {
        await challengeService.deleteChallenge(req.params.id);
        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getChallengeCompletions = async (req, res) => {
    try {
   
    const participants = await challengeService.getCompletedUsers(req.params.challengeId);
     const userIds = participants.map((p) => p.user_id);
    const users = await userService.getUsersByIds(userIds);
    res.json(users);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: err.message });
    }
};

exports.getUserChallengeStatuses = async (req, res) => {
    try {
        const challenges = await challengeService.getUserCompletedChallenges(req.params.userId);
        res.json(challenges);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.markCompleted = async (req, res) => {
    try {
        await challengeService.markCompleted(req.params.userId, req.params.challengeId);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.unmarkCompleted = async (req, res) => {
    try {
        await challengeService.unmarkCompleted(req.params.userId, req.params.challengeId);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
