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
})


module.exports = router;