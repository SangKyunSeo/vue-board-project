const router = require('express').Router();
const bodyParser = require('body-parser');
const maria = require('../database/connect/maria');

router.use(bodyParser.json());

router.post('/', (req, res) => {
    const loginVO = {
        memberId : req.body.memberId,
        memberPw : req.body.memberPw
    }

    maria.query(`SELECT * FROM member WHERE member_id = '${loginVO.memberId}' AND member_pw = '${loginVO.memberPw}'`, (err, rows) => {
        if(!err){
            res.send(rows);
        }
    });

});

module.exports = router;