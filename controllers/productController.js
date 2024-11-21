const { Product } = require('../models');
const { Op } = require('sequelize');


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
  
    console.log('Productos encontrados:', products);

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price).toFixed(2), 
      image: product.image,
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ 
      message: 'Error del servidor', 
      error: error.message 
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price).toFixed(2),
      image: product.image,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, image } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }

    const newProduct = await Product.create({
      name,
      description,
      price: parseFloat(price),
      image
    });

    res.status(201).json({
      id: newProduct.id,
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price).toFixed(2),
      image: newProduct.image
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price ? parseFloat(price) : product.price; 
    product.image = image || product.image;

    await product.save();

    res.json({
      id: product.id,
      name: product.name,
      description: product.description,
      price: parseFloat(product.price).toFixed(2),
      image: product.image
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'No se proporcionó un texto de búsqueda' });
    }

    const products = await Product.findAll({
      where: {
        name: {
          [Op.iLike]: `%${query}%`,
        },
      },
    });

    return res.status(200).json(products);
  } catch (error) {
    console.error('Error buscando productos:', error);
    return res.status(500).json({ message: 'Error buscando productos' });
  }
};




