const { sequelize } = require('../config/database');  
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const { Cart, CartItem } = require('./cart');

User.hasMany(Order);
Order.belongsTo(User);
Cart.belongsTo(User);
User.hasMany(Cart);

Order.belongsToMany(Product, { through: 'OrderProduct' });
Product.belongsToMany(Order, { through: 'OrderProduct' });
Cart.belongsToMany(Product, { through: 'CartItem' });
Product.belongsToMany(Cart, { through: 'CartItem' });

CartItem.belongsTo(Cart, { foreignKey: 'CartId' });
Cart.hasMany(CartItem, { foreignKey: 'CartId' });


module.exports = {
  sequelize,
  User,
  Product,
  Order,
  Cart,
  CartItem
};