const router = require('express').Router();
const bodyParser = require('body-parser');
const maria = require('../database/connect/maria');

router.use(bodyParser.json());

router.get('/getMyFav', (req, res) => {
    console.log(req.query.memberNum);

    maria.query(`SELECT * FROM fav WHERE member_num = ${req.query.memberNum} AND board_num = ${req.query.boardNum}`, (err, rows) => {
        if(!err){
            console.log(rows.length);
            if(rows.length > 0) res.send(true);
            else res.send(false);
        }
    });
});

router.post('/registFav', (req, res) => {
    const boardNum = req.body.boardNum;
    const memberNum = req.body.memberNum;
    console.log(`boardNum = ${boardNum} , memberNum = ${memberNum}`);

    maria.query(`INSERT INTO fav (member_num, board_num) VALUES (${memberNum}, ${boardNum})`, (err, rows) => {
        if(!err){
            res.send(true);
        }else res.send(false);
    });
});


router.post('/deleteFav', (req, res) => {
    const boardNum = req.body.boardNum;
    const memberNum = req.body.memberNum;
    console.log(`boardNum = ${boardNum} , memberNum = ${memberNum}`);

    maria.query(`DELETE FROM fav WHERE member_num = ${memberNum} AND board_num = ${boardNum}`, (err, rows) => {
        if(!err){
            res.send(true);
        }else res.send(false);
    });
});

router.get('/count', (req, res) => {
    maria.query(`SELECT COUNT(*) AS count FROM fav WHERE board_num = ${req.query.boardNum}`, (err, rows) => {
        if(!err){
            console.log(rows);
            res.send(rows);
        }
    })
});

module.exports = router;