const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, { through: 'OrderProduct' });
Product.belongsToMany(Order, { through: 'OrderProduct' });

module.exports = {
  sequelize,
  User,
  Product,
  Order
};