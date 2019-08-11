const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the team name'],
        unique: true
    },
    manager: {
        type: String,
        required: [true, 'Please provide the manager name']
    },
    trainingStadium: {
        type: String,
        required: [true, 'Please provide the stadium name']
    },
    dateCreated: {
        type: Date,
        default: new Date()
    },
});

if(!TeamSchema.indexes()){
    TeamSchema.index({ '$**': 'text' });
    //console.log(TeamSchema.indexes())
}
module.exports = mongoose.model('Teams', TeamSchema);