const challengeService = require('../services/challengeService');

exports.completeWeeklyChallenge = async (req, res) => {
const userId = req.user.id;
  const challengeId = req.params.challengeId;
    const { completed } = req.body;  
  try {
    await challengeService.markChallengeCompletion(userId, challengeId,completed);
    res.status(200).json({
      message: 'Challenge completion status updated successfully'
    });
  } catch (error) {
    console.error('Error completing challenge:', error);
    res.status(500).json({ message: 'שגיאה בעת סימון אתגר כושלם' });
  }
};

exports.updateChallenge = async (req, res) => {
  const challengeId = req.params.id;
  const { week_start_date, description } = req.body;

  try {
    await challengeService.updateChallenge(challengeId, week_start_date, description);
    res.status(200).json({ message: 'Challenge updated successfully' });
  } catch (err) {
    console.error('Error updating challenge:', err);
    res.status(500).json({ message: 'Failed to update challenge' });
  }
};

exports.getAllChallenges = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 20;
        const offset = parseInt(req.query.offset) || 0;
        const result = await challengeService.getAllChallenges(limit, offset);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// exports.createChallenge = async (req, res) => {
//     try {
//         const result = await challengeService.createChallenge(req.body);
//         res.status(201).json(result);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

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
    const users = await challengeService.getUserCompletedChallenges(req.params.challengeId);
    res.json(users);     
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
exports.createChallenge = async (req, res) => {
    try {
        const { week_start_date, description } = req.body;
        if (!week_start_date || !description) {
            return res.status(400).json({ error: "חובה לציין תאריך ואת תיאור האתגר" });
        }
        const existing = await challengeService.getChallengeByDate(week_start_date);
        if (existing) {
            return res.status(400).json({ error: "כבר קיים אתגר לאותו שבוע" });
        }
        const result = await challengeService.createChallenge({ week_start_date, description });
        res.status(201).json(result);
        
    } catch (err) {
        console.error("Error creating challenge:", err);
        res.status(500).json({ error: "שגיאה בשרת: " + err.message });
    }
};

