const { User, Chat, Message } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/db');

const getUserStats = async (req, res) => {
  try {
    const stats = await User.findAll({
      attributes: [
        'role',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['role']
    });

    const formattedStats = stats.reduce((acc, stat) => {
      acc[stat.role] = parseInt(stat.dataValues.count);
      return acc;
    }, { free: 0, premium: 0, admin: 0 });

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching user stats' });
  }
};

const getChatStats = async (req, res) => {
  try {
    const totalChats = await Chat.count();
    const totalMessages = await Message.count();
    
    const dailyStats = await Chat.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'chats']
      ],
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    res.json({
      totalChats,
      totalMessages,
      dailyStats: dailyStats.map(stat => ({
        date: stat.dataValues.date,
        chats: parseInt(stat.dataValues.chats)
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching chat stats' });
  }
};

const getModelStats = async (req, res) => {
  try {
    const stats = await Message.findAll({
      attributes: [
        'model',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        sender: 'ai',
        model: { [Op.not]: null }
      },
      group: ['model']
    });

    const formattedStats = stats.map(stat => ({
      model: stat.model || 'Unknown',
      count: parseInt(stat.dataValues.count)
    }));

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching model stats' });
  }
};

const getRevenue = async (req, res) => {
  try {
    const premiumUsers = await User.count({ where: { role: 'premium' } });
    const monthlyRevenue = premiumUsers * 9.99; // $9.99 per user
    
    // Mock revenue data for the last 12 months
    const revenueData = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const revenue = Math.floor(Math.random() * 1000) + 500; // Mock data
      revenueData.push({
        month: date.toISOString().slice(0, 7),
        revenue
      });
    }

    res.json({
      currentMonthRevenue: monthlyRevenue,
      totalRevenue: revenueData.reduce((sum, item) => sum + item.revenue, 0),
      monthlyData: revenueData
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching revenue data' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const users = await User.findAndCountAll({
      attributes: ['id', 'name', 'email', 'role', 'provider', 'createdAt', 'subscriptionEnd'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    res.json({
      users: users.rows,
      totalUsers: users.count,
      totalPages: Math.ceil(users.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching users' });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['free', 'premium', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ 
      role,
      subscriptionStart: role === 'premium' ? new Date() : null,
      subscriptionEnd: role === 'premium' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
    });

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating user role' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error deleting user' });
  }
};

module.exports = {
  getUserStats,
  getChatStats,
  getModelStats,
  getRevenue,
  getUsers,
  updateUserRole,
  deleteUser
};