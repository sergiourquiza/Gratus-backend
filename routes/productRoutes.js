const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct,searchProducts} = require('../controllers/productController');

router.get('/all', getAllProducts);

router.get('/get/:id', getProductById);

router.post('/create', createProduct);

router.put('/update/:id', updateProduct);

router.delete('/delete/:id', deleteProduct);

router.get('/search', searchProducts);



module.exports = router;
