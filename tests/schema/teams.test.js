const expect = require('chai').expect
const assert = require("chai").assert;
const testClient = require('../test.client');
const testAgent = testClient.server;

var testTeamA = testClient.testTeamA;
var testTeamB = testClient.testTeamB;


exports.teamSchemaTest = ()=>{

    it('should allow only admin to add a team to the collection', (done) => {
        testAgent.post('/api/admin/teams/add').send({
            name: testTeamA.name,
            manager: testTeamA.manager,
            trainingStadium: testTeamA.trainingStadium
          })
          .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();          
            }).catch(err=> done(err));
        
    });

    it('should allow only admin to add a second team to the collection', (done) => {
        testAgent.post('/api/admin/teams/add').send({
            name: testTeamB.name,
            manager: testTeamB.manager,
            trainingStadium: testTeamB.trainingStadium
            })
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=> done(err));
        
    });

    it('should allow user view teams in the collection', (done) => {
        testAgent.get('/api/user/activity/teams/')
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                let teams = res.body.message;
                let TeamA = teams.find(team => team.name == testTeamA.name);
                if(TeamA) testTeamA.id = TeamA._id;
                let TeamB = teams.find(team => team.name == testTeamB.name);
                if(TeamB) testTeamB.id = TeamB._id;
            
                done();
            }).catch(err=> done(err));
        
    });

    it('should allow only admin to edit a team in the teams collection', (done) => {
        testAgent.put('/api/admin/teams/edit').send({
                id: testTeamB.id,
                manager: "Sterling Macho",
                trainingStadium: "Sterling Stadia"
            })
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=>done(err));
        
    });

    it('should allow anyone to robustly search the teams collection', (done) => {
        testAgent.post('/api/search/league').send({
                searchString: "teams in Sterling Stadia"
            })
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=> done(err));
        
    });

}

exports.purgeTestTeams = ()=>{
    it('should allow only admin to delete a team from the teams collection', (done) => {
        testAgent.delete(`/api/admin/teams/delete/${testTeamA.id}`)
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=> done(err));
        
    });

    it('should allow only admin to delete the second team from the teams collection', (done) => {
        testAgent.delete(`/api/admin/teams/delete/${testTeamB.id}`)
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=> done(err));
        
    });
}