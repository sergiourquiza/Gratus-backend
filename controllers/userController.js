const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ where: { email } });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password });
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ 
      id: user.id, 
      name: user.name, 
      email: user.email, 
      token 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};