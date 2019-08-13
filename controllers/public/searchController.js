// Import Team schema/model
Fixtures = require('../../database/schemas/fixtures');
const url = require('url');
const express = require("express");
const router = express.Router();

exports.viewFixturesByUrl = async (req, res)=>{
    try{
        let fixtures;
        let fixtureUrl =  url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: req.originalUrl
          });

        if(!fixtureUrl || !fixtureUrl.includes('/search-url/')) return res.status(404).send({
            code: "01",
            message: "Invalid url"
        });

        Fixtures.findOne({ $text: { $search: fixtureUrl }}).then(fixture=>{
            console.log(fixtureUrl)
            console.log(fixture);
            return res.send({
                code: "00",
                message: fixture || []
            });
        }).catch(err=>{
            console.log(err);
            return res.send({
                code: '02',
                message: 'No fixture found with this url'
            });
        });

    }
    catch(err){
        console.log(err)
        res.send({
            code: '99',
            message: 'An exception error occoured in View Fixtures by Url controller',
            data: err
        });
    }

}

exports.searchLeague = async (req, res)=>{
    try{
        let result = [];
        const {searchString} = req.body;
        console.log(searchString)
        //Fixtures.find({ $text: { $search: searchString } }).then(res=>console.log(res)).catch(err=>console.log(err))

        if(searchString) Fixtures.find({ $text: { $search: searchString } }).then(async fixtures=>{ 
            if(fixtures.length > 0) result.push(fixtures);
            console.log(fixtures)
            await Teams.find({ $text: { $search: searchString } }).then(teams=>{
                console.log(teams);
                if(teams.length > 0) result.push(teams);
            }).catch(err=>{
            return res.send({
                code: '01',
                message: 'An unexpected error occoured while looking up your query'
            });
            })
            return res.send({
                code: '00',
                message: (result.length > 0)? 'Query succcessful' : 'No result matched your query. Consider rephrasing (eg. pending fixtures)',
                data: result
            });

        }).catch(err=>{
            console.log(err)
                return res.send({
                    code: '01',
                    message: 'An unexpected error occoured while looking up your query'
                });
            });

        else return res.send({
            code: '01',
            message: 'Invalid request body. Expected parameter searchString but found none.'
        });
    }
    catch(err){
        console.log(err)
        res.send({
            code: '99',
            message: 'An exception error occoured in League Search controller',
            data: err
        });
    }

}