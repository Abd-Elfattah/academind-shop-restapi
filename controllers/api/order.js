const Order = require('../../models/order');
const mongoose = require('mongoose');

// get all orders
module.exports.getAllOrders = (req,res,next) => {
    Order.find().select('product quantity _id')
    .populate('product', '_id name price')
    .then(orders => {
        const response = {
            count: orders.length,
            orders: orders.map( order => {
                return {
                    _id: order._id,
                    product: order.product,
                    quantity: order.quantity
                }
            })
        };
        res.status(200).json(response);
    })
    .catch(err => res.status(500).json({ error: err}));
}


//  create new order
module.exports.createOrder = (req,res,next) => {
    const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        product: req.body.productId,
        quantity: req.body.quantity
    });

    order.save()
    .then( order => {
        const response = {
            message: "Order Created Successfully",
            product: {
                id: order.product,
                url: "http://localhost:3000/api/products/" + order.product
            },
            quantity: order.quantity
        };
        // return response
        res.status(201).json(response);
    })
    .catch( err => res.status(500).json({error: err}));
}

// get one order
module.exports.getOneOrder =  (req,res,next) => {
    const id = req.params.orderId;
    Order.findById(id).select('product quantity _id')
    .populate('product','_id name price')
    .then(order => {
        const response = {
            _id: order._id,
            product: {
                details: order.product,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/api/products/" + order.product._id
                }
            },
            quantity: order.quantity
        };
        res.status(200).json(response);
    })
    .catch(err => res.status(500).json({ error: err}));
}

// delete one order
module.exports.removeOrder =  (req,res,next) => {
    const id = req.params.orderId;
    Order.remove({_id: id})
    .then(result => {
        const response = {
            message: "Order Deleted Successfully",
            request: {
                newOrder: {
                    type: "POST",
                    url: "http://localhost:3000/api/orders"
                },
                allOrders: {
                    type: "GET",
                    url: "http://localhost:3000/api/orders"
                }
            }
        };
        res.status(200).json(response);
    })
    .catch(err => res.status(500).json({ error: err}));
}