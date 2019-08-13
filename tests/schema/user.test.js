const expect = require('chai').expect
const assert = require("chai").assert;
const testAgent = require('../test.client').server;


exports.userSchemaTest = () => {

    it('should add a test  user \'test-user\' to the collection', (done) => {
            testAgent.post('/api/user/signup').send({
                    username: "test-user",
                    email: "test-user@gmail.com",
                    password: "test-user123",
                    role: 'user'
            })
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=>done(err));
    });

    it('should logon the \'test-user\'', (done) => {
        testAgent.post('/api/user/login').send({
                email: "test-user@gmail.com",
                password: "test-user123"
            })
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=> done(err));
        
    });
    
    it('should add a test admin user \'test-admin\' to the collection', (done) => {
        testAgent.post('/api/admin/signup').send({
                username: "test-admin",
                email: "test-admin@gmail.com",
                password: "test-admin123",
                role: 'admin'
            })
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=> done(err));
        
    });

    it('should logon the \'test-admin user\' ', (done) => {
        testAgent.post('/api/admin/login').send({
                email: "test-admin@gmail.com",
                password: "test-admin123"
            })
            .then(res=>{
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual('00', res.body.code, `Error: ${res.body.code} - ${res.body.message}`);
                done();
            }).catch(err=>done(err));
        
    });

    it('should Fetch all Users', (done)=>{
        testAgent.get('/api').then(res=>{
            expect(res.statusCode).to.equal(200);
            expect(res.body).to.be.an('object').that.is.not.empty;
            //expect(body).to.to.have.lengthOf(1);
            done();
        }).catch(err=>done(err));
    });

} 

exports.purgeTestUsers = ()=>{

    it('should Delete the created test-admin user from Collection', (done) => {
        testAgent.delete('/api/user/profile/delete').send({
            email: "test-admin@gmail.com",
            password: "test-admin123"
          })
          .then(res=>{
                expect(res.statusCode, "Operation Denied. Invalid admin username/password supplied").to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual(1, res.body.deleteCount, `Error: ${res.body.deleteCount} user(s) deleted`);
                done();
          }).catch(err=> done(err));
    })  

    it('should Delete the created test-user from Collection', (done) => {
        testAgent.delete('/api/user/profile/delete').send({
            email: "test-user@gmail.com",
            password: "test-user123"
            })
            .then(res=>{
                expect(res.statusCode, "Operation Denied. Invalid username/password supplied").to.equal(200);
                expect(res.body).to.be.an('object').that.is.not.empty;
                assert.strictEqual(1, res.body.deleteCount, `Error: ${res.body.deleteCount} user(s) deleted`);
                done();
            }).catch(err=> done(err));
    })
}

