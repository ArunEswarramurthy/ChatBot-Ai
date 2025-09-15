import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, MessageCircle, DollarSign, Bot, Crown, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Admin = () => {
  const [stats, setStats] = useState({
    users: { free: 0, premium: 0, admin: 0 },
    chats: { totalChats: 0, totalMessages: 0, dailyStats: [] },
    models: [],
    revenue: { currentMonthRevenue: 0, totalRevenue: 0, monthlyData: [] }
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const [userStats, chatStats, modelStats, revenueStats] = await Promise.all([
        api.get('/admin/users/stats'),
        api.get('/admin/chats/stats'),
        api.get('/admin/models/stats'),
        api.get('/admin/revenue')
      ]);

      setStats({
        users: userStats.data,
        chats: chatStats.data,
        models: modelStats.data,
        revenue: revenueStats.data
      });
    } catch (error) {
      toast.error('Failed to fetch admin stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
    } catch (error) {
      toast.error('Failed to fetch users');
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role });
      toast.success('User role updated');
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const COLORS = ['#00CFFF', '#3DFF8C', '#F806CC', '#A91079'];

  const userChartData = [
    { name: 'Free', value: stats.users.free, color: '#00CFFF' },
    { name: 'Premium', value: stats.users.premium, color: '#3DFF8C' },
    { name: 'Admin', value: stats.users.admin, color: '#F806CC' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gradient-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-main p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-white/70">Manage users and monitor platform analytics</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/5 rounded-lg p-1 mb-8">
          {['overview', 'users', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-6 rounded-md text-sm font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'bg-white/10 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Total Users</p>
                    <p className="text-2xl font-bold">
                      {stats.users.free + stats.users.premium + stats.users.admin}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-gradient-cyan" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Premium Users</p>
                    <p className="text-2xl font-bold">{stats.users.premium}</p>
                  </div>
                  <Crown className="w-8 h-8 text-gradient-green" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Total Chats</p>
                    <p className="text-2xl font-bold">{stats.chats.totalChats}</p>
                  </div>
                  <MessageCircle className="w-8 h-8 text-gradient-cyan" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm">Monthly Revenue</p>
                    <p className="text-2xl font-bold">${stats.revenue.currentMonthRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-gradient-green" />
                </div>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card"
              >
                <h3 className="text-xl font-semibold mb-4">User Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={userChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                    >
                      {userChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card"
              >
                <h3 className="text-xl font-semibold mb-4">AI Model Usage</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.models}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                    <XAxis dataKey="model" stroke="#ffffff60" />
                    <YAxis stroke="#ffffff60" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="count" fill="#00CFFF" />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 className="text-xl font-semibold mb-6">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Provider</th>
                    <th className="text-left py-3 px-4">Joined</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                          className="input-field text-sm py-1 px-2"
                        >
                          <option value="free">Free</option>
                          <option value="premium">Premium</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 capitalize">{user.provider}</td>
                      <td className="py-3 px-4">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <h3 className="text-xl font-semibold mb-4">Daily Chat Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.chats.dailyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="date" stroke="#ffffff60" />
                  <YAxis stroke="#ffffff60" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="chats" stroke="#00CFFF" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="text-xl font-semibold mb-4">Revenue Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={stats.revenue.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis dataKey="month" stroke="#ffffff60" />
                  <YAxis stroke="#ffffff60" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px'
                    }} 
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#3DFF8C" fill="#3DFF8C" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;