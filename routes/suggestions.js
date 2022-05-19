var express = require('express');
var router = express.Router();
const Joi = require('joi');
var mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const auth = require("../middleware/auth");
var [getSuggestionByWord] = require('../controllers/suggestions');

const word_dto = Joi.object({
    word: Joi.string()
        .required()
});

/* GET suggestion with an specific name */
/* POST user: login with information given as a JSON */
router.post('/searchByWord', async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    const { error } = word_dto.validate
        ({
            word: req.body.word
        });

    if (error) {
        return res.status(400).send({ message: error });
    }
    else {
        var verificacion = await getSuggestionByWord(req.body.word).then((result) => {
            console.log(result);
            if (result === null || result[0] == null) {
                bool = false;
                return res.status(200).send({ message: "This field has any suggestions"});
            }
            res.status(200).send(result);
        });
    }
});

module.exports = router;
