const server = require('../../nodejs-league-api/server');
const chai = require('chai');
chai.use(require('chai-http'));

const sessionAgent = chai.request.agent(server);

//Listen for server ready before initiating Mocha test
before((done)=>{
    server.on('appReady', done);
});
var TestTeamA = {
    id: '',
    name: 'UnitTest FC',
    manager: "Diala Emmanuel",
    trainingStadium: "Test Stadium"
}

var TestTeamB = {
    id: '',
    name: 'Sterling Utd',
    manager: "Sterling Test",
    trainingStadium: "Sterling Zone"
}
module.exports = {
    server: sessionAgent,
    testTeamA: TestTeamA,
    testTeamB: TestTeamB
};
