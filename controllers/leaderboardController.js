const Leaderboard = require('../models/Leaderboard');
// const User = require('../models/User'); // Uncomment if you want to include user info

// Submit a score to the leaderboard
exports.submitScore = async (req, res) => {
  try {
    const { userId, gameType, score } = req.body;
    let entry = await Leaderboard.findOne({ where: { userId, gameType } });
    if (!entry || score > entry.score) {
      if (entry) {
        await entry.update({ score, achievedAt: new Date() });
      } else {
        entry = await Leaderboard.create({ userId, gameType, score });
      }
      return res.json(entry);
    }
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get top N leaderboard entries for a game type
exports.getLeaderboard = async (req, res) => {
  try {
    const { gameType, limit = 10 } = req.query;
    const entries = await Leaderboard.findAll({
      where: { gameType },
      order: [['score', 'DESC'], ['achievedAt', 'ASC']],
      limit: Number(limit)
      // include: [{ model: User, attributes: ['username'] }] // Uncomment if you want to join user info
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
