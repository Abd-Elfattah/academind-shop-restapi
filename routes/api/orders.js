const express = require('express');
const router = express.Router();
// middleware to knoe if login or not
const checkAuth = require('../middleware/api/check-auth');
const orderController = require('../../controllers/api/order');


// get all orders
router.get('/' , checkAuth , orderController.getAllOrders);

//  create new order
router.post('/' , checkAuth , orderController.createOrder);

// get one order
router.get('/:orderId' , checkAuth , orderController.getOneOrder);


// delete one order
router.delete('/:orderId' , checkAuth , orderController.removeOrder);



module.exports = router;