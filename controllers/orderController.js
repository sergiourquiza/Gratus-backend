const { Order, Product, User } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    const { userId, items, total, shippingAddress } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const order = await Order.create({
      UserId: userId,
      total,
      status: 'pending',
      shippingAddress: JSON.stringify(shippingAddress)
    });

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (product) {
        await order.addProduct(product, { 
          through: { 
            quantity: item.quantity, 
            price: item.price 
          } 
        });
      }
    }
    const fullOrder = await Order.findByPk(order.id, {
      include: [
        { model: Product },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });

    res.status(201).json(fullOrder);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating order', 
      error: error.message 
    });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.findAll({
      where: { UserId: userId },
      include: [
        { model: Product },
        { model: User, attributes: ['id', 'name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching orders', 
      error: error.message 
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByPk(orderId, {
      include: [
        { model: Product },
        { model: User, attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching order', 
      error: error.message 
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating order status', 
      error: error.message 
    });
  }
};