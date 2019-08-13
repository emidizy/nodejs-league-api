// Import Team schema/model
Fixtures = require('../../database/schemas/fixtures');
Teams = require('../../database/schemas/teams');
const bcrypt = require('../../utilities/cipher');
const reqInterceptor = require('../../interceptors/request-token');
const express = require("express");
const router = express.Router();

exports.viewTeams = async (req, res)=>{
    try{
       
        let teams;
        let teamId = req.params.id;

        if(teamId) Teams.findOne({_id: teamId}).then(team=>{
            return res.send({
                code: "00",
                message: team || []
            });
        }).catch(err=>{
            console.log(err);
            return res.send({
                code: '01',
                message: 'Incorrect team id'
            })
        });

        else teams = Teams.find().then(teams=>{
            return res.send({
                code: "00",
                message: teams || []
            });
        }).catch(err=>console.log(err));

    }
    catch(err){
        console.log(err)
        res.send({
            code: '99',
            message: 'An exception error occoured in teams controller',
            data: err
        });
    }

}

exports.viewFixtures = async (req, res)=>{
    try{
       
        let fixtures;
        let fixtureId = req.params.id;

        if(fixtureId) Fixtures.findOne({_id: fixtureId}).then(fixture=>{
            return res.send({
                code: "00",
                message: fixture || []
            });
        }).catch(err=>{
            return res.send({
                code: '01',
                message: 'Incorrect fixture id'
            });
        });

        else fixtures = Fixtures.find().then(allFixtures=>{
            return res.send({
                code: "00",
                message: allFixtures || []
            });
        }).catch(err=>console.log(err));

    }
    catch(err){
        console.log(err)
        res.send({
            code: '99',
            message: 'An exception error occoured in View Fixtures controller',
            data: err
        });
    }

}

exports.viewFixturesByStatus = async (req, res)=>{
    try{
       
        let fixtures;
        let condition = null;
        let status = req.params.status;
        if (status.toLowerCase() == 'pending') condition = {matchDate: { $gt: new Date() }};
        if (status.toLowerCase() == 'completed') condition = {matchDate: { $lt: new Date() }};
        

        if(condition) Fixtures.find(condition).then(fixtures=>{
            return res.send({
                code: "00",
                message: fixtures || []
            });
        }).catch(err=>{
            return res.send({
                code: '01',
                message: 'Incorrect fixture status'
            });
        });

        else return res.send({
                code: "01",
                message: 'Incorrect fixture status. status can only be either \'pending\' or \'completed\'.'
            });
    }
    catch(err){
        console.log(err)
        res.send({
            code: '99',
            message: 'An exception error occoured in View Fixtures by Status controller',
            data: err
        });
    }

}

exports.deleteUserProfile = async (req, res)=>{
    let result = 0;
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).send({
            code: '01',
            message: 'Invalid request body'
        });
    }
    
    User.findOne({email: email}).then(user=>{
        if(user){
            //Confirm identity of user deleting his profile
            //check if password is correct
            let isValidPassword = bcrypt.verifyHash(password, user.password);
            if(isValidPassword){
                User.deleteOne({email: email}).then(result=>{
                    return res.send({deleteCount: result.n});
                }).catch(err=>{
                    console.log('Err',err)
                    return res.send({deleteCount: 0});
                })
            }
            else{
                console.log(user)
                return res.status(403).send({deleteCount: 0});
            }
        }
        else return res.status(404).send({
            code: '02',
            message: 'invalid username and/or password'
        });
    });
    
}
        
