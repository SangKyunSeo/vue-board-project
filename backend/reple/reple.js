const router = require('express').Router();
const maria = require('../database/connect/maria');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.post('/writeReple', (req, res) => {
    maria.query(`INSERT INTO reple (member_num, board_num, reple_content) VALUES (${req.body.memberNum}, ${req.body.boardNum}, '${req.body.repleContent}')`, (err, rows) => {
        if(!err){
            res.send(true);
        }else res.send(false);
    })
});

router.get('/getTodayRepleCount', (req, res) => {
    maria.query(`SELECT COUNT(*) AS count FROM reple WHERE member_num = ${req.query.memberNum} AND DATE_FORMAT(reple_regdate, '%Y/%m/%d') = '${req.query.today}'`, (err, rows) => {
        if(!err){
            res.send(rows);
        }else console.log(err);
    })
});

router.get('/getRepleList', (req, res) => {
    maria.query(`SELECT reple_num, r.member_num, board_num, reple_content, DATE_FORMAT(reple_regdate, '%Y-%m-%d') as reple_regdate, member_name FROM reple r JOIN member m ON r.member_num = m.member_num WHERE board_num = ${req.query.boardNum}`, (err, rows) => {
        if(!err){
            const repleVO = [];
            for(let row of rows){
                repleVO.push({
                    repleNum : row.reple_num,
                    memberNum : row.member_num,
                    boardNum : row.board_num,
                    repleContent : row.reple_content,
                    repleRegdate : row.reple_regdate,
                    memberName : row.member_name,
                })
            }
            res.send(repleVO);
        }else console.log(err);
    });
});

router.get('/getRepleTotalCount', (req, res) => {
    maria.query(`SELECT COUNT(*) AS count FROM reple WHERE board_num = ${req.query.boardNum}`, (err, rows) => {
        if(!err){
            res.send(rows);
        }else console.log(err);
    })
});

module.exports = router;