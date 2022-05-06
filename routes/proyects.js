var express = require('express');
var router = express.Router();
const Joi = require('joi');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const auth = require("../middleware/auth");
var [getProyectById, getProyectByHost, getProyectByDatabase, createProyect] = require('../controllers/proyects');

const proyect_structure = Joi.object({
    connectionName: Joi.string()
        .required(),

    username: Joi.string()
        .required(),

    password: Joi.string()
        .required(),

    host: Joi.string()
        .required(),
    
    port: Joi.string()
        .required(),

    databaseName: Joi.string()
        .required(),

    originalQuery: Joi.string()
        .required()
});

/* GET proyects with an specific id */
router.get('/:id', auth, async function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    const rta = await getProyectById(req.params.id).then((result) => {
        if (result === null || result[0] == null) {
            return res.status(404).send({ message: "No proyect found. Try with another id" });
        }
        res.status(200).send(result);
    });
});

/* POST proyect: given as a JSON */
router.post('/register', auth, async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    const { error } = proyect_structure.validate
        ({
            connectionName: req.body.connectionName,
            username: req.body.username,
            password: req.body.password,
            host: req.body.host,
            port: req.body.port,
            databaseName: req.body.databaseName,
            originalQuery: req.body.originalQuery
        });

    if (error) {
        return res.status(400).send({ message: error });
    }
    else {
        var findByHost = false;
        var findByDatabase = false;
        var proyectAlreadyFinded = false; 
        var verificacion = await getProyectByHost(req.body.host).then((result) => {
            if (result && result.length > 0) {
                findByHost = true;
            }
        });
        var verificacion2 = await getProyectByDatabase(req.body.databaseName).then((result) => {
            if (result && result.length > 0) {
                findByDatabase = true;
            }
        });
        if(findByHost && findByDatabase){
            proyectAlreadyFinded = true;
            return res.status(404).send({ message: "The user already has this host & database saved on DB."});
        }
        if (proyectAlreadyFinded == false) {
            var new_proyect =
            {
                connectionName: req.body.connectionName,
                username: req.body.username,
                password: req.body.password,
                host: req.body.host,
                port: req.body.port,
                databaseName: req.body.databaseName,
                originalQuery: req.body.originalQuery
            }
            const mess = await createProyect(new_proyect);
            res.status(200).send(mess);
        }
    }
});

// start business logic methods here

module.exports = router;
