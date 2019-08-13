// Import User schema/model
User = require('../../database/schemas/user');
const bcrypt = require('../../utilities/cipher');
reqInterceptor = require('../../interceptors/request-token');
const express = require("express");

exports.signIn =  async (req, res) => {
    try {
            const {email, password} = req.body;
            if (!email || !password) {
                return res.status(400).send({
                    code: '01',
                    message: 'Invalid request body'
                });
            }
            

            User.findOne({email: email}).then(user=>{
                if(user){
                    //check if password is correct
                    let isValidPassword = bcrypt.verifyHash(password, user.password);
                    if(isValidPassword){
                         //Generate Token and set user session
                        let tokenParam = {email: email, password: password, role: user.role}
                        reqInterceptor.generateToken(tokenParam).then(token=>{
                            //Set access token
                            req.session.accessToken = token;
                            return res.send({
                                code: '00',
                                message: 'Login successful!. Your session ends in 15 minutes'
                            });
                        },
                        err=>{
                            return res.send({
                                code: '03',
                                message: 'Error occoured while generating user token. Please contact support for assistance'
                            });
                        });
                       
                    }
                    else return res.send({
                        code: '02',
                        message: 'invalid username and/or password'
                    });
                   
                }
                else return res.send({
                    code: '02',
                    message: 'invalid username and/or password'
                });
            }).catch(err=>console.log(err));
       
    } 
    catch (err) {
        res.send({
            code: '99',
            message: 'An exception error occoured in login controller. kindly contact support',
            data: err
        });
    }
}
        
