const {users, leaderboards} = require('../models')

// Submit a score to the leaderboard
exports.submitScore = async (req, res) => {
  try {
    const { user_id, game_id, score } = req.body;
    let entry = await leaderboards.findOne({ where: { userId, gameType } });
    if (!entry || score > entry.score) {
      if (entry) {
        await entry.update({ score, achievedAt: new Date() });
      } else {
        entry = await leaderboards.create({ user_id, game_id, score });
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
    const { game_id, limit = 10 } = req.query;
    const entries = await leaderboards.findAll({
      where: { game_id },
      order: [['score', 'DESC'], ['achievedAt', 'ASC']],
      limit: Number(limit),
      include: [{ model: users, attributes: ['first_name', 'last_name'] }] 
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
