require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'postgres',
  process.env.DB_USER, 
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    logging: console.assert
  }
  
);

module.exports = sequelize;
