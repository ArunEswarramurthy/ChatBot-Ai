const { User, Chat, Message } = require('../models');

const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = { free: 0, premium: 0, admin: 0 };
    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
    });

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching user stats' });
  }
};

const getChatStats = async (req, res) => {
  try {
    const totalChats = await Chat.countDocuments();
    const totalMessages = await Message.countDocuments();
    
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyStats = await Chat.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          chats: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    res.json({
      totalChats,
      totalMessages,
      dailyStats: dailyStats.map(stat => ({
        date: stat._id,
        chats: stat.chats
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching chat stats' });
  }
};

const getModelStats = async (req, res) => {
  try {
    const stats = await Message.aggregate([
      {
        $match: {
          sender: 'ai',
          model: { $ne: null }
        }
      },
      {
        $group: {
          _id: '$model',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = stats.map(stat => ({
      model: stat._id || 'Unknown',
      count: stat.count
    }));

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching model stats' });
  }
};

const getRevenue = async (req, res) => {
  try {
    const premiumUsers = await User.countDocuments({ role: 'premium' });
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

    const totalUsers = await User.countDocuments();
    const users = await User.find({}, 'name email role provider createdAt subscriptionEnd')
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
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

    const user = await User.findByIdAndUpdate(
      userId,
      {
        role,
        subscriptionStart: role === 'premium' ? new Date() : null,
        subscriptionEnd: role === 'premium' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error updating user role' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
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