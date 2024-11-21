const express = require('express');
const { register, login, getProfile, updatePassword,updateProfile} = require('../controllers/userController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getProfile);
router.put('/update-profile', updateProfile);
router.put('/update-password', updatePassword);

module.exports = router;