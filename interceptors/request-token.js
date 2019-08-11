//import json web token
const jwt = require('jsonwebtoken');
const config = require('../config');

function generateToken(data){
    return new Promise((resolve, reject)=>{
        //Set token to expire in 12hrs
        jwt.sign(data, config.SECRET, {expiresIn: '43200s'}, (err, token)=>{
            if(err)reject(err);

            else resolve(token);
        });
    })

}

async function validateToken(req, res, next){

    let accessToken = null;
    if(req.session)  accessToken  = req.session.accessToken;
    //console.log(req.session);
    
    if(!accessToken){
        return res.status(403).send({
            code: '09',
            message: 'This resource requires authorization. Kindly login to gain access',
            extras: 'Err09: Invalid or Expired token'
        });
    }
       
    let data;
    await jwt.verify(accessToken, config.SECRET, (err, data)=>{
        if(err) this.data = null;

        this.data = data;
    });
    if(!this.data){
        return res.status(403).send({
            code: '09',
            message: 'Invalid/expired token. please log in'
        });
    }
    res.locals.user = this.data;
    next();
}

function confirmAdminRole(req, res, next){
    const user = res.locals.user;
    if(user && user.role != config.ADMIN){
        return res.status(403).send({
            code: '09',
            message: 'Not permitted. Operation requires admin privilege. Kindly login as admin to access this resource'
        });
    }
    next();
}


async function validateTokenDeprecated(bearerHeader, userRole){
    // const tokenString = (bearerHeader) ? bearerHeader.split(' ')[1] : null;
    // if(!tokenString){
    //     return {
    //         code: "1X",
    //         message: 'This resource requires an authorization header'
    //     };
    // }
       
    // let data;
    // await jwt.verify(tokenString, config.SECRET, (err, data)=>{
    //     if(err) this.data = null;

    //     this.data = data;
    // });
    // if(!this.data){
    //     return {
    //         code: '2X',
    //         message: 'Invalid/expired token'
    //     };
    // }
    // if(userRole && this.data.role != userRole){
    //     return {
    //         code: "3X",
    //         message: 'Not permitted. Operation requires admin privilege. Kindly login as admin to access this resource'
    //     };
    // }
    // return {
    //     code: '00',
    //     message: this.data
    // }
}

module.exports = {
    generateToken,
    validateToken,
    confirmAdminRole
}