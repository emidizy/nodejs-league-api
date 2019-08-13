const expect = require('chai').expect
const assert = require("chai").assert;
const testClient = require('../test.client');
const request = require('request');
const testAgent = testClient.server;

var testTeamA = testClient.testTeamA;
var testTeamB = testClient.testTeamB;
var fixtureId = '';
var fixtureUrl = '';


exports.fixtureSchemaTest = ()=>{
    
    it('should allow admin view teams in the collection', (done) => {
        testAgent.get('/api/admin/teams/')
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

    it('should allow only admin to create a fixture', (done) => {
        Date.prototype.addHours= function(h){
            this.setHours(this.getHours()+h);
            return this;
        }
        testAgent.post('/api/admin/fixtures/add').send({
            homeTeamId: testTeamA.id,
            awayTeamId: testTeamB.id,
            matchDate: new Date().addHours(3).toString()
          })
          .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();          
            }).catch(err=> done(err));
        
    });

    it('should allow user view pending fixtures in the collection', (done) => {
        testAgent.get('/api/user/activity/fixtures/pending')
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                let fixtures = res.body.message;
                testFixture = fixtures.find(fixture => fixture.homeTeam == testTeamA.name || fixture.awayTeam == testTeamB.name);
                for(var fixture in testFixture){
                    fixtureId = testFixture._id;
                    break;
                }
                
                done();
            }).catch(err=> done(err));
        
    });

    it('should allow only admin to get fixtures in the collection by id', (done) => {
        testAgent.get(`/api/admin/fixtures/${fixtureId}`)
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=> done(err));
        
    });


    it('should allow only admin to edit fixtures', (done) => {
        testAgent.put('/api/admin/fixtures/edit').send({
                id: fixtureId,
                matchDate: new Date().toString(),
                scoreLine : "2:0",
                scorers: "Diala 47', 84' ",
                matchStatus: "completed"
            })
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=>done(err));
        
    });

    it('should allow user view completed fixtures', (done) => {
        testAgent.get('/api/user/activity/fixtures/completed')
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=> done(err));
        
    });

    it('should allow anyone to robustly search the fixture collection', (done) => {
        testAgent.post('/api/search/league').send({
                searchString: "completed matches"
            })
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=> done(err));
        
    });

    it('should allow only admin to generate URL for a fixture', (done) => {

        testAgent.post('/api/admin/fixtures/url/generate').send({
            id: fixtureId     
          })
          .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                fixtureUrl = res.body.data;
                done();          
            }).catch(err=> done(err));
        
    });

    it('should allow user view fixture by url', (done) => {

        request.get(fixtureUrl, (req, res, body)=>{
            try{
                expect(res.statusCode).to.equal(200);
                body = JSON.parse(body)
                assert.strictEqual('00', body.code, `Error: ${body.code} - ${body.message}`);
                expect(body.message.url).to.be.a('string').that.is.equal(fixtureUrl, "Wrong Fixture retrieved");
                done();
            }catch(err){
                done(err);
            }
               
        });

    });
}

exports.purgeTestFixture = ()=>{
    it('should allow only admin to delete a fixture from the fixture collection', (done) => {
        testAgent.delete(`/api/admin/fixtures/delete/${fixtureId}`)
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=> done(err));
        
    });
}