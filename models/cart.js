const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user');
const Product = require('./product');

const Cart = sequelize.define('Cart', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});


Cart.belongsTo(User, { foreignKey: 'userId' });  

const CartItem = sequelize.define('CartItem', {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  CartId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Cart,
      key: 'id',
    },
  },
  ProductId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Product,
      key: 'id',
    },
  },
});

Cart.hasMany(CartItem, { foreignKey: 'CartId' }); 
CartItem.belongsTo(Cart, { foreignKey: 'CartId' });  

Product.hasMany(CartItem, { foreignKey: 'ProductId' }); 
CartItem.belongsTo(Product, { foreignKey: 'ProductId' });  

Cart.hasMany(CartItem, { 
  foreignKey: 'CartId',
  onDelete: 'CASCADE', 
  hooks: true 
});

CartItem.belongsTo(Cart, { 
  foreignKey: 'CartId',
  onDelete: 'CASCADE',
  hooks: true 
});

module.exports = { Cart, CartItem };
