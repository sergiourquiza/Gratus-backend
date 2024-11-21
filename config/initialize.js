const { sequelize } = require('./config/database'); 
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const index = require('./models/index');  
const Cart = require('./models/cart');
const CartItem = require('./models/cart');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL server established.');

    const dbName = process.env.DB_NAME;
    const createDbQuery = `CREATE DATABASE IF NOT EXISTS "${dbName}"`;
    await sequelize.query(createDbQuery);
    console.log(`Database "${dbName}" is ready.`);

    const newSequelize = new Sequelize(
      dbName, 
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
      }
    );

    await newSequelize.sync({ force: true });  
    console.log('Database synchronized successfully.');
  
  } catch (error) {
    console.error('Error creating or synchronizing the database:', error);
  } finally {
    await sequelize.close();
  }
})();
