const { users, user_activity, user_progress, sequelize, dialects, roles, users_roles, flagged_words } = require('../models');
const { Op } = require('sequelize');

const getTotalusers = async (req, res) => {
  try {
    const totalusers = await users.count();
    res.json({ data: totalusers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTotalActiveusers = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get unique user IDs who have logged in within the last week
    const activeUsers = await user_activity.findAll({
      where: { last_login: { [Op.gte]: oneWeekAgo } },
      attributes: [
        'user_id',
        [sequelize.fn('MAX', sequelize.col('last_login')), 'last_login']
      ],
      group: ['user_id'],
      include: [{
        model: users,
        required: true,
        include: [{
          model: roles,
          required: true,
          through: { attributes: [] },
          where: { role_name: 'Student' },
          attributes: []
        }],
        attributes: []
      }]
    });

    res.json({ data: activeUsers.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopContributors = async (req, res) => {
  try {
    // Get number of dialects for max possible score
    const dialectCount = await dialects.count();
    const maxScore = 100 * dialectCount;

    // Aggregate total dialect_progress per user
    const topContributors = await user_progress.findAll({
      attributes: [
        'user_id',
        [sequelize.fn('SUM', sequelize.col('dialect_progress')), 'totalDialectProgress']
      ],
      group: ['user_id', 'user.id', 'user.username', 'user.email'],
      order: [[sequelize.col('totalDialectProgress'), 'DESC']],
      limit: 5,
      include: [{ model: users, attributes: ['username', 'email'] }]
    });

    // Add percentage of max possible score
    const result = topContributors.map(tc => {
      const total = parseFloat(tc.get('totalDialectProgress'));
      return {
        user_id: tc.user_id,
        username: tc.user?.username,
        email: tc.user?.email,
        totalDialectProgress: total,
        percentageOfMax: maxScore > 0 ? ((total / maxScore) * 100).toFixed(2) : null
      };
    });

    res.json({data: result});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecentlyActiveusers = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Get the latest login per user in the last week
    const recentLogins = await user_activity.findAll({
      where: { last_login: { [Op.gte]: oneWeekAgo } },
      attributes: [
        'user_id',
        [sequelize.fn('MAX', sequelize.col('last_login')), 'last_login']
      ],
      group: ['user_id'],
      order: [[sequelize.fn('MAX', sequelize.col('last_login')), 'DESC']],
      limit: 5,
      include: [{
        model: users,
        attributes: ['id', 'username', 'email', 'first_name', 'last_name'],
        include: [
          {
            model: roles,
            through: { attributes: [] },
            where: { role_name: 'Student' },
            attributes: []
          },
          {
            model: user_progress
          }
        ]
      }]
    });

    res.json({ data: recentLogins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopStudentsProgressGraph = async (req, res) => {
  try {
    const topStudents = await user_progress.findAll({
      attributes: ['user_id', [sequelize.fn('SUM', sequelize.col('progress')), 'totalProgress']],
      group: ['user_id', 'user.id', 'user.username'],
      order: [[sequelize.col('totalProgress'), 'DESC']],
      limit: 5,
      include: [{ model: users, attributes: ['username'] }]
    });

    res.json({data: topStudents});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CRUD for Dialects
const createDialect = async (req, res) => {
  try {
    const { dialect_name, dialect_description, no_of_games, dialect_status } = req.body;
    const dialect = await dialects.create({ dialect_name, dialect_description, no_of_games, dialect_status });
    res.status(201).json({ data: dialect });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDialects = async (req, res) => {
  try {
    const allDialects = await dialects.findAll();
    res.json({ data: allDialects });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDialectById = async (req, res) => {
  try {
    const { id } = req.params;
    const dialect = await dialects.findByPk(id);
    if (!dialect) return res.status(404).json({ error: 'Dialect not found' });
    res.json({ data: dialect });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDialect = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await dialects.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ error: 'Dialect not found' });
    const updatedDialect = await dialects.findByPk(id);
    res.json({ data: updatedDialect });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDialect = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dialects.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Dialect not found' });
    res.json({ message: 'Dialect deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Flagged Words: get and delete
const getFlaggedWords = async (req, res) => {
  try {
    const flagged = await flagged_words.findAll();
    res.json({ data: flagged });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFlaggedWord = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await flagged_words.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Flagged word not found' });
    res.json({ message: 'Flagged word deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTotalusers,
  getTotalActiveusers,
  getTopContributors,
  getRecentlyActiveusers,
  getTopStudentsProgressGraph,
  // Dialect CRUD
  createDialect,
  getDialects,
  getDialectById,
  updateDialect,
  deleteDialect,
  // Flagged Words
  getFlaggedWords,
  deleteFlaggedWord
};
