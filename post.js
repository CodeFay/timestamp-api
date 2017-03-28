// The Post model https://gist.github.com/fwielstra/1025038

var mongoose = require('mongoose');

// do we need to do data validation/set type of data?
var linkSchema = mongoose.Schema({
    //date: {type: Date, default: Date.now},
    _id:  { type: Number },
    longURL: { type: String }
});

module.exports = mongoose.model('Link', linkSchema);