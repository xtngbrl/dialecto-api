const {users, words, game_progress, leaderboards} = require('../models')
const { Op } = require('sequelize');

// Helper function to update leaderboard after game progress changes
const updateLeaderboardEntry = async (user_id, gameType) => {
  try {
    // Total all scores for this user and gameType
    const total = await game_progress.sum('score', { where: { user_id, gameType } });
    if (total === null) return null;
    
    let entry = await leaderboards.findOne({ where: { user_id, gameType } });
    if (entry) {
      await entry.update({ total_score: total, achievedAt: new Date() });
    } else {
      entry = await leaderboards.create({ user_id, gameType, total_score: total });
    }
    return entry;
  } catch (err) {
    console.error('Error updating leaderboard:', err.message);
    return null;
  }
};

// Create or update game progress for a user and game type
const { updateUserProgress } = require('./userProgressController');

exports.upsertProgress = async (req, res) => {
  const user_id = req.user.id;
  try {
    const { gameType, score, details, dialect_id } = req.body;
    if (!dialect_id) {
      return res.status(400).json({ error: 'dialect_id is required' });
    }
    let progress = await game_progress.findOne({ where: { user_id, gameType, dialect_id } });
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
        attempts: 1,
        dialect_id
      });
    }
    
    // Update leaderboard after successful game progress upsert
    await updateLeaderboardEntry(user_id, gameType);

    // Update user progress for this dialect
    await updateUserProgress(user_id, dialect_id);
    
    res.status(201).json(progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const filter = { user_id: req.query.userId };
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
    const progress = await game_progress.findOne({ where: { user_id: userId, gameType } });
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    await progress.update({ score: 0, attempts: 0, details: {} });
    res.status(201).json(progress);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
