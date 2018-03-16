const router = require('express').Router();
const Joi = require('joi');

schema = Joi.object().keys({
    code: Joi.string()
});

const createOrAuthenticate = (code) => {
    // TODO: Create/Authenticate user and retrieve user object.
    return {token: 'asdf1234'}
}

router.post('/', function(req, res) {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
        return res.status(420).send({code: 420, message: 'Invalid request body'});
    }
    const user = createOrAuthenticate(req.body.code);
    if (!user) {
        return res.status(400).send({code: 400, message: "Couldn't create or authenticate user."});
    }
    return res.status(200).send(user);
});

module.exports = router;