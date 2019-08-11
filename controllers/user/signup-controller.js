// Import User schema/model
User = require('../../database/schemas/user');
const cipher = require('../../utilities/cipher');
const express = require("express");
const router = express.Router();

exports.register =  async (req, res) => {

    try {
            const {username, password, email} = req.body;
            if (!username || !password || !email) {
                return res.status(400).send({
                    code: '01',
                    message: 'Invalid request body'
                });
            }

            //Check if user already Exists

            User.findOne({email: email}).then(user=>{
                if(user){
                    res.send({
                        code: '02',
                        message: `user '${email}' is already registered`
                    });
                }
                else{
                    let role = 'user';
                    let newUser = new User({
                        username,
                        email,
                        password,
                        role
                    });
                    let hashedPassword = cipher.hash(newUser.password);
                    if(hashedPassword){
                        newUser.password = hashedPassword;
                        newUser.save().then(onSuccess=>{
                            res.send({
                                code: '00',
                                message: 'Registration successful'
                            });
                        })
                        .catch(err=>{
                            res.send({
                                code: '03',
                                message: 'An unexpected error occoured. please retry'
                            })
                        });
                    }
                    else res.send({
                        code: '03',
                        message: 'An error occured. kindly contact support for assistance'
                    });

                }
            });       
               
    } 
    catch (err) {
        res.send({
            code: '99',
            message: 'An exception error occoured in signup controller',
            data: err
        });
    }
}
        
