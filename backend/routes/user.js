var express = require('express');
var router = express.Router();

const getUser = (token) => {
  // TODO: Retrieve user from database.
  return {id: "userid"};
}

router.get('/', (req, res) => {
  const user = getUser(req.myToken);
  if (!user) {
    return res.status(404).send({code: 404, message: "Coudln't find user."});
  }
  res.send(user);
});

module.exports = router;
