const express = require('express');
const { 
  createOrder, 
  getUserOrders, 
  getOrderById, 
  updateOrderStatus 
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/create-order/', protect, createOrder);

router.get('/user/:userId', protect, getUserOrders);

router.get('/:orderId', protect, getOrderById);

router.patch('/:orderId/status', protect, updateOrderStatus);

module.exports = router;