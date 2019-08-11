// Import Team schema/model
Teams = require('../../database/schemas/teams');
const reqInterceptor = require('../../interceptors/request-token')
const express = require("express");
const router = express.Router();

exports.create = async (req, res)=>{
    try{

        const {name, manager, trainingStadium, dateCreated} = req.body;
        if (!name || !manager || !trainingStadium) {
            return res.status(400).send({
                code: '01',
                message: 'Invalid request body'
            });
        }

        //Check if Team already exists
        Teams.findOne({name: name}).then(team=>{
            if(team){
                return res.send({
                    code: '02',
                    message: `The team '${name}' already exist`
                });
            }
            else{
                //Create Team
                let newTeam = new Teams({
                    name,
                    manager,
                    trainingStadium,
                    dateCreated
                });
                newTeam.save().then(onSuccess=>{
                   return  res.send({
                        code: '00',
                        message: `Team ${name} has been created succesfully`
                    });
                })
                .catch(err=>{
                   return  res.send({
                        code: '03',
                        message: 'An unexpected error occoured. please retry'
                    })
                });
            }
        }).catch(err=>{
            console.log(err);
            return res.send({
                code: '03',
                message: 'An unexpected error occoured. kindly retry'
            })
        })

    }
    catch(err){
        return res.send({
            code: '99',
            message: 'An exception error occoured in teams controller',
            data: err
        });
    }
}

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

exports.modifyTeam = async (req, res)=>{
    try{
        
        const {id, name, manager, trainingStadium, dateCreated} = req.body;
        if(!id) return res.status(400).send({
            code: '01',
            message: 'team id required'
        });
        if(!name && !manager && !trainingStadium && !dateCreated){
            return res.status(400).send({
                code: '01',
                message: 'invalid update request'
            });
        }

        let condition = {_id: id};
        let updateParams = {}
        if(name) updateParams.name = name;
        if(manager) updateParams.manager = manager;
        if(trainingStadium) updateParams.trainingStadium = trainingStadium;
        if(dateCreated) updateParams.dateCreated = dateCreated;
        
        var newvalues = { $set: updateParams };
        Teams.updateOne(condition, newvalues).then(onSuccess=>{
            res.send({
                code: '00',
                message: `Team info has been updated succesfully. ${onSuccess.modifiedCount} parameters modified`
            });
        })
        .catch(err=>{
            res.send({
                code: '03',
                message: 'An error occoured. Team id not valid'
            });
        });
    }
    catch(err){
        res.send({
            code: '99',
            message: 'An exception error occoured in teams controller',
            data: err
        });
    }
}

exports.deleteTeam = async (req, res)=>{
    try{
        
        let id = req.params.id;
        console.log(id)
        if(!id) return res.status(400).send({
            code: '01',
            message: 'Team id required'
        });

        Teams.deleteOne({_id: id})
        .then(result=>{

            if(result.n > 0){
                return res.send({
                    code: '00',
                    message: 'Team deleted successfully'
                })
            }
            else return res.send({
                code: '02',
                message: 'Supplied team id does not exist'
            });
        }).catch(err=>{
            console.log(err)
            return res.send({
                code: '02',
                message: 'An error occoured. supplied team id not valid'
            });
        });
        
    }
    catch(err){
        res.send({
            code: '99',
            message: 'An exception error occoured in teams controller',
            data: err
        });
    }
}