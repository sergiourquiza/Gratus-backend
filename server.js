require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Servidor corriendo correctamente en el puerto ' + process.env.PORT });
});

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos.');

    sequelize.sync().then(() => {
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
      });
    });
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });
