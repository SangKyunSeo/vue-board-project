const router = require('express').Router();
const maria = require('../database/connect/maria');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.post('/setAttendPoint', (req, res) => {
    maria.query(`INSERT INTO point (member_num, point_cate, point_score, point_type) VALUES (${req.body.memberNum}, 3,  ${req.body.pointScore}, 1)`, (err, rows) => {
        if(!err){
            res.send(true);
        }else res.send(false);
    })
});

router.post('/useFreeBoard', (req, res) => {
    maria.query(`INSERT INTO point (member_num, point_cate, point_score, point_type) VALUES (${req.body.memberNum}, ${req.body.pointCate}, ${req.body.pointScore}, ${req.body.pointType})`, (err, rows) => {
        if(!err){
            res.send(true);
        }else res.send(false);
    })
});

router.post('/useAnonyBoard', (req, res) => {
    maria.query(`INSERT INTO point (member_num, point_cate, point_score, point_type) VALUES (${req.body.memberNum}, ${req.body.pointCate}, ${req.body.pointScore}, ${req.body.pointType})`, (err, rows) => {
        if(!err){
            res.send(true);
        }else res.send(false);
    })
});

router.post('/addPointReple', (req, res) => {
    maria.query(`INSERT INTO point (member_num, point_cate, point_score, point_type) VALUES (${req.body.memberNum}, ${req.body.pointCate}, ${req.body.pointScore}, ${req.body.pointType})`, (err, rows) => {
        if(!err){
            res.send(true);
        }else res.send(false);
    })
});

router.get('/getMyPointDetail', (req, res) => {
    maria.query(`SELECT * FROM point WHERE member_num = ${req.query.memberNum} ORDER BY point_date DESC`, (err, rows) => {
        if(!err){
            const myPointDetail = [];

            for(let row of rows){
                myPointDetail.push({
                    pointNum : row.point_num,
                    memberNum : row.member_num,
                    pointCate : row.point_cate,
                    pointScore : row.point_score,
                    pointType : row.point_type,
                    pointDate : row.point_date
                });
            }
            console.log(myPointDetail);
            res.send(myPointDetail);
        }else console.log(err);
    });
});

router.get('/getMyGamePointDetail', (req, res) => {
    maria.query(`SELECT * FROM game_point gp LEFT JOIN game g ON gp.game_num = g.game_num WHERE member_num = ${req.query.memberNum} ORDER BY game_point_date DESC`, (err, rows) => {
        if(!err){
            const myGamePointDetail = [];

            for(let row of rows){
                myGamePointDetail.push({
                    gamePointNum : row.game_point_num,
                    gameNum : row.game_num,
                    memberNum : row.member_num,
                    gamePointDate : row.game_point_date,
                    gamePointType : row.game_point_type,
                    gamePoint : row.game_point,
                    gameTitle : row.game_title
                });
            }
            console.log(myGamePointDetail);
            res.send(myGamePointDetail);
        }else console.log(err);
    });
});

module.exports = router;