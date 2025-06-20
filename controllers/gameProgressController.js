const {users, words, game_progress, leaderboards} = require('../models')
const { Op } = require('sequelize');

// Create or update game progress for a user and game type
exports.upsertProgress = async (req, res) => {
  const user_id = req.user.id;
  try {
    const { gameType, score, details } = req.body;
    let progress = await game_progress.findOne({ where: { user_id, gameType } });
    if (progress) {
      await progress.update({
        score,
        details,
        lastPlayed: new Date(),
        attempts: progress.attempts + 1
      });
    } else {
      progress = await game_progress.create({
        user_id,
        gameType,
        score,
        details,
        attempts: 1
      });
    }
    res.satus(201).json(progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const filter = { userId: req.query.userId };
    if (req.query.gameType) filter.gameType = req.query.gameType;
    const progress = await game_progress.findAll({ where: filter });
    res.status(200).json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset progress for a user and game type
exports.resetProgress = async (req, res) => {
  try {
    const { userId, gameType } = req.body;
    const progress = await game_progress.findOne({ where: { userId, gameType } });
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    await progress.update({ score: 0, attempts: 0, details: {} });
    res.status(201).json(progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
