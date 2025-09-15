const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  chatId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Chats',
      key: 'id'
    }
  },
  sender: {
    type: DataTypes.ENUM('user', 'ai'),
    allowNull: false
  },
  model: {
    type: DataTypes.STRING,
    allowNull: true
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Message;