const mdbconn = require('../lib/utils/mongo.js');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
let database = "Tesis";
let collection = "proyects";

function getProyectById(proyectId) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).aggregate([{ $match: { _id: ObjectId(proyectId) } }]).toArray();
    });
}

function getProyectByHost(host) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).aggregate([{ $match: { host: host } }]).toArray();
    });
}

function getProyectByDatabase(databaseName) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).aggregate([{ $match: { databaseName: databaseName } }]).toArray();
    });
}

function createProyect(new_proyect) {
    return mdbconn.conn().then((client) => {
        return client.db(database).collection(collection).insertOne(new_proyect).finally();
    });
}

module.exports = [getProyectById, getProyectByHost, getProyectByDatabase, createProyect];