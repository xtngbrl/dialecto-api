const { users, user_activity, user_progress, sequelize, dialects, roles, users_roles } = require('../models');
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

    const totalActiveusers = await user_activity.count({
      where: { last_login: { [Op.gte]: oneWeekAgo } },
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
      distinct: true
    });

    res.json({ data: totalActiveusers });
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
    const recentlyActiveusers = await user_activity.findAll({
      where: { last_login: { [Op.gte]: oneWeekAgo } },
      order: [['last_login', 'DESC']],
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

    res.json({data: recentlyActiveusers});
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

module.exports = {
  getTotalusers,
  getTotalActiveusers,
  getTopContributors,
  getRecentlyActiveusers,
  getTopStudentsProgressGraph
};
