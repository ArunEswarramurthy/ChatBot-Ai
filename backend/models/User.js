const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  provider: {
    type: DataTypes.ENUM('local', 'google'),
    defaultValue: 'local'
  },
  role: {
    type: DataTypes.ENUM('free', 'premium', 'admin'),
    defaultValue: 'free'
  },
  subscriptionStart: {
    type: DataTypes.DATE,
    allowNull: true
  },
  subscriptionEnd: {
    type: DataTypes.DATE,
    allowNull: true
  },
  stripeCustomerId: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

User.prototype.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.isPremium = function() {
  return this.role === 'premium' && 
         this.subscriptionEnd && 
         new Date() < new Date(this.subscriptionEnd);
};

module.exports = User;