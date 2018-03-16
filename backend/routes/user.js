var express = require('express');
var router = express.Router();
const authMiddleware = require('../authMiddleware');


router.post('/', authMiddleware, function(req, res, next) {
  res.send({token: 'asd'});
});

module.exports = router;
