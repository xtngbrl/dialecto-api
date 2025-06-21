const { users, user_activity, user_progress } = require('../models');
const { Op } = require('sequelize');

const getTotalusers = async (req, res) => {
  try {
    const totalusers = await users.count();
    res.json({ totalusers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTotalActiveusers = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const totalActiveusers = await user_activity.count({
      where: { last_login: { [Op.gte]: oneWeekAgo } }
    });

    res.json({ totalActiveusers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopContributors = async (req, res) => {
  try {
    const topContributors = await user_progress.findAll({
      attributes: ['user_id', [sequelize.fn('SUM', sequelize.col('progress')), 'totalProgress']],
      group: ['user_id'],
      order: [[sequelize.literal('totalProgress'), 'DESC']],
      limit: 5
    });

    res.json(topContributors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecentlyActiveusers = async (req, res) => {
  try {
    const recentlyActiveusers = await user_activity.findAll({
      order: [['last_login', 'DESC']],
      limit: 5,
      include: [{ model: users, attributes: ['id', 'username', 'email'] }]
    });

    res.json(recentlyActiveusers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopStudentsProgressGraph = async (req, res) => {
  try {
    const topStudents = await user_progress.findAll({
      attributes: ['users_id', [sequelize.fn('SUM', sequelize.col('progress')), 'totalProgress']],
      group: ['users_id'],
      order: [[sequelize.literal('totalProgress'), 'DESC']],
      limit: 5,
      include: [{ model: users, attributes: ['username'] }]
    });

    res.json(topStudents);
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
