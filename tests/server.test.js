const expect = require('chai').expect
const assert = require("chai").assert;
const testAgent = require('./test.client').server;
const config = require('../../nodejs-league-api/config');
const userSchema = require('../../nodejs-league-api/tests/schema/user.test');
const teamSchema = require('../../nodejs-league-api/tests/schema/teams.test');
const fixtureSchema = require('../../nodejs-league-api/tests/schema/fixtures.test');


describe('SERVER TEST', ()=>{

    it('API Home', (done)=>{
        testAgent.get('/api')
            .then((res)=>{
                //expect(res).to.have.cookie('sessionid');
                // The `agent` now has the sessionid cookie saved, and will send it
                // back to the server in the next request:
                expect(res.statusCode).to.equal(200);
                expect(JSON.stringify(res.body)).to.equal(JSON.stringify({
                    'status': 'Api is LIVE',
                    'message': 'Welcome to Premier League API hub. Developed by Diala Emmanuel'
                }));
                done();
            }).catch(err=> done(err));
    })

    //Create and perform actions on various schemas using test data
    describe('USER SCHEMA TEST', userSchema.userSchemaTest);
    describe('TEAM SCHEMA TEST', teamSchema.teamSchemaTest);  
    describe('FIXTURE SCHEMA TEST', fixtureSchema.fixtureSchemaTest);

    //Delete Test Data from DataStore
    describe('DELETE TEST FIXTURES', fixtureSchema.purgeTestFixture);
    describe('DELETE TEST TEAMS', teamSchema.purgeTestTeams);
    describe('DELETE TEST USERS', userSchema.purgeTestUsers);
})