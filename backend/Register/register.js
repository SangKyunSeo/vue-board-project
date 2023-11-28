const router = require('express').Router();
const bodyParser = require('body-parser');

const maria = require('../database/connect/maria');

router.use(bodyParser.json());

router.post('/idDuplicateCheck',(req, res) => {
    maria.query(`SELECT * FROM member WHERE member_id = '${req.body.id}'`, (err, rows, fields) => {
        if(!err){
            res.send(rows);
        }else{
            console.log('err : ' + err);
        }
    });
});

router.post('/', (req, res) => {
    const registerVO = {
        member_name : req.body.memberName,
        member_id : req.body.memberId,
        member_pw : req.body.memberPw,
    }
    let memberGender = req.body.gender === 'male' ? 1 : 2;
    let msg = '';
    maria.query(`INSERT INTO member(member_name, member_id, member_pw, member_gender) VALUES ('${registerVO.member_name}', '${registerVO.member_id}','${registerVO.member_pw}','${memberGender}')`, (err, rows) => {
        if(!err){
            msg = '회원가입을 성공했습니다.';
            res.send(msg);
        }else{
            msg = '회원가입을 실패했습니다.';
            res.send(msg);
        }
    });
});

module.exports = router;