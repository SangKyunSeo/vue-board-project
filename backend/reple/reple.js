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
    maria.query(`SELECT COUNT(*) AS count FROM reple WHERE member_num = ${req.query.memberNum} AND DATE_FORMAT(reple_regdate, '%Y/%m/%d')`, (err, rows) => {
        if(!err){
            res.send(rows);
        }else console.log(err);
    })
});

module.exports = router;