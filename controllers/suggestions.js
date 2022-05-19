const mdbconn = require('../lib/utils/mongo.js');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
let database = "Tesis";
let collection = "suggestions";

function getSuggestionByWord(wordSearched) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).find({word:{ "$in": wordSearched.split(" ")}}).toArray();
    });
}

module.exports = [getSuggestionByWord];