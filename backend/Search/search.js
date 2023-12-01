const router = require('express').Router();
const bodyParser = require('body-parser');
const maria = require('../database/connect/maria');

router.use(bodyParser.json());

// 자유글 검색 API
router.post('/getFreeSearch', (req, res) => {
    maria.query('SELECT ' + 
    'b.board_num, board_title, board_content, board_hit, board_category, b.member_num, board_regdate, board_mdate, m.member_name, board_regdate, ' +
    'COUNT(r.reple_num) as reple_count , f.fav_count ' + 
    'FROM board b ' + 
    'LEFT JOIN member m ON b.member_num = m.member_num ' + 
    'LEFT JOIN reple r on b.board_num = r.board_num ' +
    'LEFT JOIN ' +
    '(SELECT b.board_num, COUNT(f.fav_num) AS fav_count FROM board b LEFT JOIN fav f on b.board_num = f.board_num GROUP BY b.board_num) f ' + 
    'ON b.board_num = f.board_num ' + 
    'WHERE board_category = ' + req.body.boardCategory + 
    ' AND (board_content LIKE \'%' + req.body.word + '%\' ' + 
    'OR board_title LIKE \'%' + req.body.word + '%\') GROUP BY b.board_num', (err, rows) => {
        if(!err){
            const boardVO = [];
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
                })
            }
            res.send(boardVO);
        }else console.log(err);
    })
});

// 익명글 검색 API
router.post('/getAnonySearch', (req , res) => {
    maria.query('SELECT ' +
    'b.board_num, board_title, ' + 
    'board_content, board_hit, ' + 
    'board_category, b.member_num, ' + 
    'board_regdate, board_mdate, ' + 
    'board_regdate, COUNT(r.reaction_num) AS reaction_count ' + 
    'FROM board b ' + 
    'LEFT JOIN reaction r ON b.board_num = r.board_num ' + 
    'WHERE board_category = ' + req.body.boardCategory + 
    ' AND (board_content LIKE \'%' + req.body.word + '%\' OR board_title LIKE \'%' + req.body.word + '%\')' + 
    ' AND DATE_FORMAT(b.board_regdate,\'%Y-%m-%d\') = CURDATE() ' + 
    'OR DATE_FORMAT(b.board_mdate,\'%Y-%m-%d\') = CURDATE() ' + 
    'GROUP BY b.board_num', (err, rows) => {
        if(!err){
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
                    reactionTotal : row.reaction_count
                });
            }
            res.send(boardVO);
        }else console.log(err);
    })
});




module.exports = router;