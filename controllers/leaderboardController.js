const {users, leaderboards, game_progress} = require('../models')

// Update leaderboard by totaling game scores for a user and gameType

exports.updateLeaderboard = async (req, res) => {
  try {
    const { user_id, gameType } = req.body;
    // Total all scores for this user and gameType
    const total = await game_progress.sum('score', { where: { user_id, gameType } });
    if (total === null) return res.status(404).json({ error: 'No game progress found for this user and gameType' });
    let entry = await leaderboards.findOne({ where: { user_id, gameType } });
    if (entry) {
      await entry.update({ total_score: total, achievedAt: new Date() });
    } else {
      entry = await leaderboards.create({ user_id, gameType, total_score: total });
    }
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get total leaderboard scores for all users (sum across all gameTypes)
exports.getAllUsersTotalLeaderboard = async (req, res) => {
  try {
    const entries = await leaderboards.findAll({
      attributes: [
        'user_id',
        [leaderboards.sequelize.fn('SUM', leaderboards.sequelize.col('total_score')), 'total_score']
      ],
      group: ['user_id', 'user.id'],
      order: [
        [leaderboards.sequelize.fn('SUM', leaderboards.sequelize.col('total_score')), 'DESC']
      ],
      include: [{ model: users, attributes: ['first_name', 'last_name', 'id'] }]
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get top N leaderboard entries for a game type
exports.getLeaderboard = async (req, res) => {
  try {
    const { gameType, limit = 10 } = req.query;
    const entries = await leaderboards.findAll({
      where: { gameType },
      order: [['total_score', 'DESC'], ['achievedAt', 'ASC']],
      limit: Number(limit),
      include: [{ model: users, attributes: ['first_name', 'last_name'] }]
    });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
