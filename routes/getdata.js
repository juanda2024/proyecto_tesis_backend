var express = require('express');
var router = express.Router();
const Joi = require('joi');
require('dotenv').config();

//Libreria para conectar con PostgreSQL
var pg = require('pg');

const info_dto = Joi.object({
    username: Joi.string()
    .required(),
    password: Joi.string()
        .required(),
    host: Joi.string()
        .required(),
    port: Joi.number()
        .required(),
    databaseName: Joi.string()
    .required(),
    query: Joi.string()
    .required()
});

router.post('/obtaininfo/', async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    const { error } = info_dto.validate
        ({
            username: req.body.username,
            password: req.body.password,
            host: req.body.host,
            port: req.body.port,
            databaseName: req.body.databaseName,
            query: req.body.query,

        });

    if (error) {
        return res.status(400).send({ message: error });
    }
    else {
        var pgClient = new pg.Client({
            user: req.body.username,
            password: req.body.password,
            database: req.body.databaseName,
            port: req.body.port,
            host: req.body.host,
            ssl: { rejectUnauthorized: false }
        }); 
        await pgClient.connect();
        const rta = await pgClient.query(req.body.query).then((result) => {
            if (result === null) {
                return res.status(404).send({ message: "Query error." });
            }
            var numberRows = result.rowCount;
            var finalResult = []
            for(var i = 0; i<numberRows/10 - 1; i++){
                finalResult.push(result.rows[i])
            }
            pgClient.end();
            res.status(200).send(finalResult);
        });
        }
});

module.exports = router;