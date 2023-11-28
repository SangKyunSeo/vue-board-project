const router = require('express').Router();
const maria = require('../../database/connect/maria');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

router.get('/popularBoardList', (req, res) => {
    maria.query('SELECT ' + 
    '*, ' +
    'COUNT(r.reple_num) as reple_count , f.fav_count ' + 
    'FROM board b ' + 
    'LEFT JOIN member m ON b.member_num = m.member_num ' + 
    'LEFT JOIN reple r on b.board_num = r.board_num ' +
    'LEFT JOIN ' +
    '(SELECT b.board_num, COUNT(f.fav_num) AS fav_count FROM board b LEFT JOIN fav f on b.board_num = f.board_num GROUP BY b.board_num) f ' + 
    'ON b.board_num = f.board_num ' + 
    'WHERE board_category = 1 GROUP BY b.board_num ORDER BY b.board_hit DESC', (err, rows) => {
        const boardVO = [];
        for(let row of rows){
            boardVO.push({
                boardNum : row.board_num,
                boardTitle : row.board_title,
                boardContent : row.board_content,
                boardHit : row.board_hit,
                boardCategory : row.board_category,
                memberNum : row.member_num,
                boardRegdate : row.board_regdate,
                boardMdate : row.board_mdate,
                repleCount : row.reple_count,
                favCount : row.fav_count
            });
        };

        if(!err){
            res.send(boardVO);
        }
    });
});

router.get('/myBoardCount', (req, res) => {
    maria.query(`SELECT COUNT(*) AS count FROM board WHERE member_num = ${req.query.memberNum}`, (err, rows) => {
        if(!err){
            res.send(JSON.stringify(rows));
        }
    })
});

router.get('/getMyPoint', (req, res) => {
    maria.query(`SELECT IFNULL(SUM(point_score),0) - (SELECT IFNULL(SUM(point_score),0) FROM point WHERE member_num = ${req.query.memberNum} AND point_type = 2) AS pointScore FROM point WHERE member_num = ${req.query.memberNum} AND point_type = 1`, (err, rows) => {
        if(!err){
            console.log('포인트 : ' + rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    })
});

router.get('/getTodayAttend', (req, res) => {
    maria.query(`SELECT * FROM attend WHERE member_num = ${req.query.memberNum} AND DATE_FORMAT(attend_date, '%Y/%m/%d') = '${req.query.now}'`, (err, rows) => {
        if(!err){
            console.log(rows);
            res.send(rows);
        }else{
            console.log(err);
        }
    })
});

module.exports = router;