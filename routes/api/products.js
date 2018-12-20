const express = require('express');
const router = express.Router();

// middleware to know if login or not
const checkAuth = require('../middleware/api/check-auth');
// require controller
const productController = require('../../controllers/api/product');

// require multer middleware for file uploads
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null, './uploads/');
    },
    filename: function(req,file,cb) {
        cb(null, Date.now() + file.originalname);
    }
});
const upload = multer({storage: storage});

// get all products
router.get('/' , productController.getAllProducts);

// create new product
router.post('/' , checkAuth , upload.single("productImage") ,productController.createProduct);

// get one product
router.get('/:id' , productController.getOneProduct);

// remove one product
router.delete('/:id' , checkAuth , productController.removeProduct);

// update product
router.put('/:id' , checkAuth , productController.updateProduct);

module.exports = router;