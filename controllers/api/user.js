const User = require('../../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//      sign up users
module.exports.signup =  (req,res,next) => {
    User.find({email: req.body.email})
    .then(users => {
        //      if email exists
        if ( users.length >= 1 ) {
            res.status(409).json({message: "Eamil Already Exist"});
        } else {
            //      if Email not Exist 
            bcrypt.hash(req.body.password , 10 , (err,hash) => {
                if(err) {
                    res.status(500).json({error: err});
                } else {
                    //      create new user
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save()
                    .then( user => {
                        res.status(201).json({message: "User Created Successfully"});
                    })
                    .catch(err => res.status(500).json({error: err}));
                }
                
            });
        }
        
    });
    
    
}



//      Login user
module.exports.login = (req,res,next) => {
    User.find({email: req.body.email})
    .then(users => {
        //  check email exist or not
        if (users.length < 1){
            return res.status(401).json({message: "Authentication Failed, Check Email and Password"});
        }

        //      check for password
        bcrypt.compare( req.body.password , users[0].password , (err, result)=>{
            if(err) {
                return res.status(401).json({message: "Authentication Failed, Check Email and Password"});
            }

            // if password correct *result=true if password correct*
            if(result) {
                // jwt.sign(payload, secretOrPrivateKey, [options, callback])
                // assign jwt and sent it to responseif success
                const token = jwt.sign(
                    {userId: users[0]._id, email: users[0].email},
                    "secretKey",
                    {expiresIn: "1h"}
                );
                return res.status(200).json({
                    message: "Authentication Success",
                    token: token
                });
            }

            // if password not correct *result = false* in this state
            return res.status(401).json({message: "Authentication Failed, Check Email and Password"});
        });

    })
    .catch(err => res.status(500).json({error: err}));
}



//      delete user
module.exports.deleteUser =  (req,res,next) => {
    User.remove({_id: req.params.userId})
    .then( result => {
        res.status(200).json({message: "User Deleted Successfully"});
    })
    .catch(err => res.status(500).json({error: err}));
    
}