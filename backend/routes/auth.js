const router = require('express').Router();
const Joi = require('joi');

schema = Joi.object().keys({
    code: Joi.string()
});

router.post('/', function(req, res) {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(420).send({code: 420, message: 'Invalid request body'});
    }
    return res.status(200).send({token: 'generatedtoken'});
});

module.exports = router;