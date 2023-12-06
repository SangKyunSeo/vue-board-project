const router = require('express').Router();
const maria = require('../database/connect/maria');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.get('/getMemberDetail', (req, res) => {
    maria.query('SELECT ' +
                'm.member_num, m.member_name, m.member_id, m.member_gender, m.member_regdate, m.member_auth, free_count, anony_count FROM ' + 
                'member m ' + 
                'LEFT JOIN ' + 
                '(SELECT COUNT(*) AS free_count, member_num FROM board WHERE member_num = ' + 
                req.query.memberNum + 
                ' AND board_category = 1) f ' + 
                'ON m.member_num = f.member_num ' + 
                'LEFT JOIN ' + 
                '(SELECT COUNT(*) AS anony_count, member_num FROM board WHERE member_num = ' +
                req.query.memberNum +
                ' AND board_category = 2) a ' +
                'ON m.member_num = a.member_num ' + 
                'WHERE m.member_num = ' + req.query.memberNum, (err, rows) => {
                    if(!err){
                        const memberDetailVO = {
                            memberNum : rows[0].member_num,
                            memberName : rows[0].member_name,
                            memberAuth : rows[0].member_auth,
                            memberId : rows[0].member_id,
                            memberGender : rows[0].member_gender,
                            memberRegdate : rows[0].member_regdate,
                            freeCount : rows[0].free_count === null ? 0 : rows[0].free_count,
                            anonyCount : rows[0].anony_count === null ? 0 : rows[0].anony_count
                        }
                        console.log(memberDetailVO);
                        res.send(memberDetailVO);
                    }else console.log(err);
                })
});

router.post('/updateName', (req, res) => {
    maria.query(`UPDATE member SET member_name = '${req.body.memberName}' WHERE member_num = ${req.body.memberNum}`, (err, rows) => {
        if(!err) res.send(true);
        else console.log(err);
    });
});

module.exports = router;