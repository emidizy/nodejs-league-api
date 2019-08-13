// Import Team schema/model
Fixtures = require('../../database/schemas/fixtures');
Teams = require('../../database/schemas/teams');
const reqInterceptor = require('../../interceptors/request-token');
const urlGenerator = require('../../utilities/url-generator');
const express = require("express");
const router = express.Router();

exports.create = async (req, res)=>{
    try{
       
        const {homeTeamId, awayTeamId, matchDate} = req.body;
        if (!homeTeamId || !awayTeamId || !matchDate) {
            return res.status(400).send({
                code: '01',
                message: 'Invalid request body'
            });
        }
        if(homeTeamId == awayTeamId) return res.send({
            code: '01',
            message: 'Invalid match fixture. Same team detected'
        });

        let matchStartDate = (typeof matchDate === "string")? new Date(matchDate): matchDate;

        if(new Date() > matchStartDate){
            return res.send({
                code: '01',
                message: 'Invalid parameter \'matchDate\'. Supplied date has past'
            });
        }

        Teams.findOne({_id: homeTeamId}).then(homeTeamInfo=>{
            //console.log(homeTeamInfo);
            let homeTeam = homeTeamInfo.name;
            Teams.findOne({_id: awayTeamId}).then(awayTeamInfo=>{
                let awayTeam = awayTeamInfo.name;

                let matchInfo = {homeTeam, awayTeam, matchDate: matchStartDate};
            //Check if Fixture already exists
                Fixtures.findOne(matchInfo).then(fixture=>{
                    if(fixture){
                        return res.send({
                            code: '02',
                            message: `The fixture '${homeTeam}' vs '${awayTeam}' already exist`
                        });
                    }
                    else{
                        //Create Fixture
                        let newFixture = new Fixtures(matchInfo);
                        newFixture.save().then(onSuccess=>{
                        return  res.send({
                                code: '00',
                                message: `Fixture '${homeTeam}' vs '${awayTeam}' has been created succesfully`
                            });
                        })
                        .catch(err=>{
                            console.log(err)
                        return  res.send({
                                code: '03',
                                message: 'An unexpected error occoured. please contact support'
                                
                            })
                        });
                    }
                }).catch(err=>{
                    console.log(err);
                    return res.send({
                        code: '03',
                        message: 'An unexpected error occoured. kindly retry',
                        data: err.message
                    })
                })

            }).catch(err=>{
                // console.log(err);
                return res.send({
                    code: '04',
                    message: 'Supplied Away team id not valid'
                });
            });
        }).catch(err=>{
            return res.send({
                code: '04',
                message: 'Supplied Home team id not valid'
            });
        });
        
    }
    catch(err){
        console.log(err);
        return res.send({
            code: '99',
            message: 'An exception error occoured in Create Fixtures controller',
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

exports.modifyFixture = async (req, res)=>{
    try{
        
        const {id,homeTeam, awayTeam, matchDate, scoreLine, url, scorers, matchStatus} = req.body;
        if(!id && !url) return res.status(400).send({
            code: '01',
            message: 'Fixture id or fixture url required in request body'
        });
        if(!homeTeam && !awayTeam && !matchDate && !scoreLine && !url && !scorers && !matchStatus){
            return res.status(400).send({
                code: '01',
                message: 'invalid update request parameters.'
            });
        }
        if(scoreLine && !scoreLine.split(':')[1]){
            return res.status(400).send({
                code: '01',
                message: 'invalid score line. Format required - (0:0)'
            });
        }

        let condition = (id)? {_id: id} : {url: url};
        let updateParams = {}
        if(homeTeam) updateParams.homeTeam = homeTeam;
        if(awayTeam) updateParams.awayTeam = awayTeam;
        if(matchDate) updateParams.matchDate = (typeof matchDate === "string")? new Date(matchDate): matchDate;
        if(scoreLine) updateParams.scoreLine = scoreLine;
        if(scorers) updateParams.scorers = scorers;
        if(matchStatus) updateParams.matchStatus = matchStatus;

        var newvalues = { $set: updateParams };
        Fixtures.updateOne(condition, newvalues).then(onSuccess=>{

            Fixtures.findOne(condition).then(teamInfo=>{

                return res.send({
                    code: '00',
                    message: `Fixture info has been updated succesfully. ${onSuccess.nModified} parameter(s) modified`,
                    data: teamInfo || []
                });
            });
           
        })
        .catch(err=>{
            return res.send({
                code: '03',
                message: 'An error occoured. Fixture id not valid'
            });
        });
    }
    catch(err){
        res.send({
            code: '99',
            message: 'An exception error occoured in Modify Fixtures controller',
            data: err
        });
    }
}

exports.deleteFixture = async (req, res)=>{
    try{
       
        let id = req.params.id;
       // console.log(id)
        if(!id) return res.status(400).send({
            code: '01',
            message: 'Fixture id required'
        });

        Fixtures.deleteOne({_id: id})
        .then(result=>{

            if(result.n > 0){
                return res.send({
                    code: '00',
                    message: 'Fixture deleted successfully'
                })
            }
            else return res.send({
                code: '02',
                message: 'Supplied fixture id does not exist'
            });
        }).catch(err=>{
            console.log(err)
            return res.send({
                code: '02',
                message: 'An error occoured. supplied fixture id not valid'
            });
        });
        
    }
    catch(err){
        res.send({
            code: '99',
            message: 'An exception error occoured in Delete Fixture controller',
            data: err
        });
    }
}

exports.generateFixtureUrl = async (req, res)=>{
    try{
        const {id} = req.body;
        if(!id) return res.status(400).send({
            code: '01',
            message: 'Fixture id required in request body'
        });
        
        Fixtures.findOne({_id: id}).then(fixture=>{
            //Generate unique url for fixture
            let teams =  `${fixture.homeTeam.replace(/\s+/g, '')}vs${fixture.awayTeam.replace(/\s+/g, '')}`;
            let generatedUrl = urlGenerator.generateUrl(teams);
            let condition = {_id: id};
            let updateParams = {url: generatedUrl}
            
            var newvalues = { $set: updateParams };
            Fixtures.updateOne(condition, newvalues).then(onSuccess=>{
                console.log('FixtureUrl:', generatedUrl);
                return res.send({
                    code: '00',
                    message: `Fixture url generated successfully. (You may open url on a browser to view fixture)`,
                    data: generatedUrl || []
                });
            })
            .catch(err=>{
                return res.send({
                    code: '03',
                    message: 'An error occoured. Supplied Fixture id not valid'
                });
            });

        }).catch(err=>{
            return res.send({
                code: '01',
                message: 'Incorrect fixture id'
            });
        });
        
    }
    catch(err){
        console.log(err);
        res.send({
            code: '99',
            message: 'An exception error occoured in Generate Fixture Url controller',
            data: err
        });
    }
}

