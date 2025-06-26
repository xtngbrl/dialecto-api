const { user_progress, game_progress, dialects } = require('../models');
const { Op } = require('sequelize');

// Utility: Calculate progress percentage for a gameType and details object
function calculateGameProgressPercentage(gameType, details) {
  if (!details) return 0;
  switch (gameType) {
    case 'quiz':
      if (details.totalSteps && details.correctAnswers !== undefined) {
        return Math.round((details.correctAnswers / details.totalSteps) * 100);
      }
      break;
    case 'shoot':
      if (details.result === 'win') return 100;
      if (details.wordsHit && details.targets && Array.isArray(details.targets)) {
        return Math.round((details.wordsHit / details.targets.length) * 100);
      }
      break;
    case 'jumbled':
      if (details.completed === true) return 100;
      if (details.currentWords && details.totalWords) {
        return Math.round((details.currentWords.length / details.totalWords) * 100);
      }
      break;
    case 'match':
      if (details.finishedAt) return 100;
      if (details.correctAnswers && details.totalSteps) {
        return Math.round((details.correctAnswers / details.totalSteps) * 100);
      }
      break;
    default:
      return 0;
  }
  return 0;
}

// Update user_progress for a user and dialect after a game progress update
exports.updateUserProgress = async (user_id, dialect_id) => {
  // All 4 game types
  const gameTypes = ['shoot', 'jumbled', 'match', 'quiz'];
  let gamePercentages = {};
  let total = 0;
  let count = 0;

  for (const gameType of gameTypes) {
    const progress = await game_progress.findOne({
      where: { user_id, gameType, dialect_id }
    });
    let percent = 0;
    if (progress) {
      percent = calculateGameProgressPercentage(gameType, progress.details);
    }
    gamePercentages[gameType] = percent;
    total += percent;
    count++;
  }

  // Dialect progress is the average of all 4 games
  const dialectProgress = count > 0 ? Math.round(total / count) : 0;

  // Upsert user_progress
  let userProgress = await user_progress.findOne({ where: { user_id, dialect_id } });
  if (userProgress) {
    await userProgress.update({
      dialect_progress: dialectProgress,
      game_progress_percentages: gamePercentages
    });
  } else {
    await user_progress.create({
      user_id,
      dialect_id,
      dialect_progress: dialectProgress,
      game_progress_percentages: gamePercentages,
      level: 1,
      progress: 0
    });
  }
};
