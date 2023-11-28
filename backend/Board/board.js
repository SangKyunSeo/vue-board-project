const router = require('express').Router();
const bodyParser = require('body-parser');
const maria = require('../database/connect/maria');

router.use(bodyParser.json());
router.post('/writeBoard', (req, res) => {
    const boardVO = {
        memberNum: req.body.memberNum,
        boardTitle: req.body.boardTitle,
        boardContent: req.body.boardContent,
        boardCategory: req.body.boardCategory,
        boardHit: 0
    }

    maria.query(`INSERT INTO board (board_title, board_content, board_hit, board_category, member_num) `
     + `VALUES ('${boardVO.boardTitle}','${boardVO.boardContent}',${boardVO.boardHit},${boardVO.boardCategory},${boardVO.memberNum})`, (err, rows) => {
        if(!err){
            res.send('success');
            console.log('success');
        }else{
            console.log(err);
        }
     });
});

router.get('/freeBoardList', (req, res) => {
    const boardVO = [];
    maria.query(
        'SELECT ' + 
        'b.board_num, board_title, board_content, board_hit, board_category, b.member_num, board_regdate, board_mdate, m.member_name, board_regdate, ' +
        'COUNT(r.reple_num) as reple_count , f.fav_count ' + 
        'FROM board b ' + 
        'LEFT JOIN member m ON b.member_num = m.member_num ' + 
        'LEFT JOIN reple r on b.board_num = r.board_num ' +
        'LEFT JOIN ' +
        '(SELECT b.board_num, COUNT(f.fav_num) AS fav_count FROM board b LEFT JOIN fav f on b.board_num = f.board_num GROUP BY b.board_num) f ' + 
        'ON b.board_num = f.board_num ' + 
        'WHERE board_category = 1 GROUP BY b.board_num ORDER BY b.board_regdate DESC', (err, rows) => {
        if(!err){
            for(let row of rows){
                boardVO.push({
                    boardNum : row.board_num,
                    boardTitle : row.board_title,
                    boardContent : row.board_content,
                    boardHit : row.board_hit,
                    boardCategory : row.board_category,
                    memberNum : row.member_num,
                    memberName: row.member_name,
                    boardRegdate : row.board_regdate,
                    boardMdate : row.board_mdate,
                    repleCount : row.reple_count,
                    favCount : row.fav_count
                });
            }
            res.send(boardVO);
        }else console.log(err);
    })
});

router.get('/anonyBoardList', (req, res) => {
    const boardVO = [];
    maria.query(`SELECT board_num, board_title, board_content, board_hit, board_category, b.member_num, board_regdate, board_mdate, m.member_name, board_regdate FROM board b LEFT JOIN member M ON b.member_num = m.member_num WHERE board_category = 2 AND DATE_FORMAT(b.board_regdate,'%Y-%m-%d') = CURDATE() OR DATE_FORMAT(b.board_mdate,'%Y-%m-%d') = CURDATE() ORDER BY b.board_regdate DESC`, (err, rows) => {
        if(!err){
            for(let row of rows){
                boardVO.push({
                    boardNum : row.board_num,
                    boardTitle : row.board_title,
                    boardContent : row.board_content,
                    boardHit : row.board_hit,
                    boardCategory : row.board_category,
                    memberNum : row.member_num,
                    memberName: row.member_name,
                    boardRegdate : row.board_regdate,
                    boardMdate : row.board_mdate
                });
            }
            res.send(boardVO);
        }
    })
});

router.get('/freeBoardDetail', (req, res) => {
    
    maria.query(`SELECT * FROM board b JOIN member m ON b.member_num = m.member_num WHERE board_num = ${req.query.boardNum}`, (err, rows) => {
        if(!err){
            const boardDetailVO = {
                boardNum : rows[0].board_num,
                boardTitle: rows[0].board_title,
                boardContent: rows[0].board_content,
                boardHit: rows[0].board_hit,
                boardRegdate: rows[0].board_regdate,
                boardMdate: rows[0].board_mdate,
                memberNum: rows[0].member_num,
                memberName: rows[0].member_name
            }
            res.send(boardDetailVO);
        }else{
            console.log(err);
        }
    })
});

router.post('/addHit', (req, res) => {
    maria.query(`UPDATE board SET board_hit = board_hit + 1 WHERE board_num = ${req.body.boardNum}`, (err, rows) => {
        if(!err) res.send('true');
        else console.log(err);
    })
})

module.exports = router;