const { Cart, CartItem, Product } = require('../models');

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        include: {
          model: Product,
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    if (cart.CartItems.length === 0) {
      return res.status(200).json({ message: 'Your cart is empty' });
    }

    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    if (!userId || !productId || quantity === undefined) {
      return res.status(400).json({ message: 'Invalid input parameters' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cartItem = await CartItem.findOne({
      where: { CartId: cart.id, ProductId: productId },
    });

    if (cartItem) {
     
      cartItem.quantity = quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        CartId: cart.id,
        ProductId: productId,
        quantity,
        userId,
      });
    }

    const updatedCart = await Cart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        include: {
          model: Product,
        },
      },
    });

    return res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = await CartItem.findOne({
      where: { CartId: cart.id, ProductId: productId },
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    await cartItem.destroy();

    
    const updatedCart = await Cart.findOne({
      where: { userId },
      include: {
        model: CartItem,
        include: {
          model: Product,
        },
      },
    });

    return res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

const deleteAllCartItems = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'ID de usuario inválido' });
    }

    const cart = await Cart.findOne({ where: { userId } });

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    await CartItem.destroy({ where: { CartId: cart.id } });

    return res.status(200).json({ message: 'Elementos eliminados' });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error eliminando los elementos' });
  }
};


module.exports = { getCart, updateCart, removeFromCart, deleteAllCartItems };
