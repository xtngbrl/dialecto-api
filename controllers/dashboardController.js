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

    // Get unique user IDs who have logged in within the last week and are students
    const activeUserIds = await user_activity.findAll({
      where: { last_login: { [Op.gte]: oneWeekAgo } },
      attributes: [[sequelize.col('user_activity.user_id'), 'user_id']],
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
      }],
      group: ['user_activity.user_id'],
      raw: true
    });

    res.json({ data: activeUserIds.length });
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

    // Get the latest login per user in the last week using a raw query for correct grouping
    const [results] = await sequelize.query(`
      SELECT ua.* FROM user_activity ua
      INNER JOIN (
        SELECT user_id, MAX(last_login) AS last_login
        FROM user_activity
        WHERE last_login >= :oneWeekAgo
        GROUP BY user_id
      ) latest ON ua.user_id = latest.user_id AND ua.last_login = latest.last_login
      ORDER BY ua.last_login DESC
      LIMIT 5
    `, {
      replacements: { oneWeekAgo },
      model: user_activity,
      mapToModel: true
    });

    // Now fetch user details for these user_ids
    const userIds = results.map(r => r.user_id);
    const usersList = await users.findAll({
      where: { id: userIds },
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
    });

    // Merge user_activity and user details
    const merged = results.map(ua => {
      const user = usersList.find(u => u.id === ua.user_id);
      return { ...ua.toJSON(), user };
    });

    res.json({ data: merged });
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
