const mongoose = require('mongoose');
const Product = require('../../models/product');

// get all products
module.exports.getAllProducts =  (req,res,next) => {
    Product.find()
    .select('name price _id')
    .then( products => {
        const response = {
            count: products.length,
            products: products.map( product => {
                return {
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/api/products/' + product._id
                    }
                }
            })
        };
        res.status(200).json(response);
    })
    .catch( err => res.status(500).json({error: err}));
}


// create new product
module.exports.createProduct = (req,res,next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save()
    .then( (product) => {
        const respone = {
            message: "Product created Successfully",
            product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                productImage: product.productImage,
                request: {
                    type: "GET",
                    urle: "http://localhost:3000/api/products/" + product._id
                }
            }
        };
        res.status(201).json(respone);
    })
    .catch( err => res.status(500).json({error: err}));
}

// get one product
module.exports.getOneProduct =  (req,res,next) => {
    const id = req.params.id;
    Product.findById(id)
    .select('name price _id')
    .then( product => {
        if(product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({message: "no product for this Id"});
        }
    })
    .catch( err => res.status(500).json({message: err}));

}

// remove one product
module.exports.removeProduct = (req,res,next) => {
    const id = req.params.id;
    Product.remove({_id: id})
    .then( result => {
        const response = {
            message: "Product Deleted Successfuly",
            request: {
                create_new: {
                    type: "POST",
                    url: "http://localhost:3000/api/products"
                },
                other_products: {
                    type: "GET",
                    url: "http://localhost:3000/api/products"
                }
            }
        };
        res.status(200).json(response);
    })
    .catch( err => res.status(500).json({message: err}));

}

// update product
module.exports.updateProduct =  (req,res,next) => {
    const id = req.params.id;
    
    // make an array for updated properties
    const updatePro = {};
    for( const pro of req.body){
        updatePro[pro.name] = pro.value;
    }
    // make update query
    Product.update({_id: id} , { $set: updatePro})
    .then(result => {
        const response = {
            message: "Products updated Successfuly",
            product: {
                url: "http://localhost:3000/api/products/" + id
            }
        } 
        res.status(200).json(response);
    })
    .catch(err => res.status(500).json({message: err}));

}