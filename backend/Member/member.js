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

router.get('/getMyFreeBoardList', (req, res) => {
    maria.query('SELECT ' + 
    'b.board_num, board_title, board_hit, board_category, b.member_num, board_regdate, board_mdate, m.member_name, board_regdate, ' +
    'COUNT(r.reple_num) as reple_count , f.fav_count ' + 
    'FROM board b ' + 
    'LEFT JOIN member m ON b.member_num = m.member_num ' + 
    'LEFT JOIN reple r on b.board_num = r.board_num ' +
    'LEFT JOIN ' +
    '(SELECT b.board_num, COUNT(f.fav_num) AS fav_count FROM board b LEFT JOIN fav f on b.board_num = f.board_num GROUP BY b.board_num) f ' + 
    'ON b.board_num = f.board_num ' + 
    'WHERE board_category = ' +  
    req.query.boardCategory +
    ' AND member_num = ' + 
    req.query.memberNum +
    ' GROUP BY b.board_num ORDER BY b.board_regdate DESC', (err, rows) => {
        if(!err){
            const boardListVO = [];
            for(let row of rows){
                boardListVO.push({
                    boardNum : row.board_num,
                    boardTitle : row.board_title,
                    boardHit : row.boardHit,
                    boardCategory : row.board_category,
                    boardRegdate : row.board_regdate,
                    boardMdate : row.board_mdate,
                    memberNum : row.member_num,
                    memberName : row.member_name,
                    repleCount : row.reple_count,
                    favCount : row.fav_count
                });
            }
            console.log(boardListVO);
            res.send(boardListVO);
        }else console.log(err);
    });
});

router.get('/getMyAnonyBoardList', (req, res) => {
    maria.query(`SELECT b.board_num, board_title, board_content, board_hit, board_category, b.member_num, board_regdate, board_mdate, board_regdate, COUNT(r.reaction_num) AS reaction_count FROM board b LEFT JOIN reaction r ON b.board_num = r.board_num WHERE board_category = ${req.query.boardCategory} AND b.member_num = ${req.query.memberNum} GROUP BY b.board_num ORDER BY b.board_regdate DESC`, (err, rows) => {
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
            console.log(boardVO);
            res.send(boardVO);
        }else console.log(err);
    });
});

module.exports = router;