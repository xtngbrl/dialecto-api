const GameProgress = require('../models/GameProgress');
const { Op } = require('sequelize');

// Create or update game progress for a user and game type
exports.upsertProgress = async (req, res) => {
  try {
    const { userId, gameType, score, details } = req.body;
    let progress = await GameProgress.findOne({ where: { userId, gameType } });
    if (progress) {
      await progress.update({
        score,
        details,
        lastPlayed: new Date(),
        attempts: progress.attempts + 1
      });
    } else {
      progress = await GameProgress.create({
        userId,
        gameType,
        score,
        details,
        attempts: 1
      });
    }
    res.json(progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get progress for a user (optionally filter by game type)
exports.getProgress = async (req, res) => {
  try {
    const filter = { userId: req.query.userId };
    if (req.query.gameType) filter.gameType = req.query.gameType;
    const progress = await GameProgress.findAll({ where: filter });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset progress for a user and game type
exports.resetProgress = async (req, res) => {
  try {
    const { userId, gameType } = req.body;
    const progress = await GameProgress.findOne({ where: { userId, gameType } });
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    await progress.update({ score: 0, attempts: 0, details: {} });
    res.json(progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
