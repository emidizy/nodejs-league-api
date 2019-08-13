const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
    homeTeam: {
        type: String,
        required: [true, 'Please provide your the team name'],
    },
    awayTeam: {
        type: String,
        required: [true, 'Please provide the manager name'],
    },
    matchDate: {
        type: Date,
        required: [true, 'Please provide the match date']
    },
    scoreLine: {
        type: String,
        default: 'pending',
    },
    url:{
        type: String,
        default: 'N/A'
    },
    scorers:{
        type: String,
        default: 'pending'
    },
    matchStatus:{
        type: String,
        default: 'pending',
    }
});


if(!fixtureSchema.indexes()){
    fixtureSchema.index({ '$**': 'text' });
    //console.log(fixtureSchema.indexes())
}

module.exports = mongoose.model('Fixtures', fixtureSchema);