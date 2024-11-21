// routes/cartRoutes.js
const express = require('express');
const { getCart, updateCart, removeFromCart, deleteAllCartItems } = require('../controllers/cartController.js');

const router = express.Router();

router.get('/:userId', getCart);

router.post('/:userId', updateCart);

router.delete('/:userId/:productId', removeFromCart);

router.delete('/:userId', deleteAllCartItems);

module.exports = router;
