const router = require('express').Router();
const bodyParser = require('body-parser');
const maria = require('../database/connect/maria');

router.use(bodyParser.json());

router.post('/setAttend', (req, res) => {

    maria.query(`INSERT INTO attend (member_num) VALUES (${req.body.memberNum})`, (err, rows) => {
        if(!err){
            res.send(true);
        }else res.send(false);
    })
});

module.exports = router;