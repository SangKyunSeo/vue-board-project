const router = require('express').Router();
const maria = require('../database/connect/maria');
const bodyParser = require('body-parser');
router.use(bodyParser.json());


router.get('/getRepleNum', (req, res) => {
    maria.query('SELECT IFNULL(MAX(reple_num), 0) + 1 as reple_num FROM reple', (err, rows) => {
        if(!err){
            const repleNum = rows[0].reple_num;
            res.send({repleNum : repleNum});
        }else console.log(err);
    });
})

router.post('/writeReple', (req, res) => {
    maria.query(`INSERT INTO reple (reple_num, member_num, board_num, reple_content, group_id, reple_depth, child_nums, parent_id) VALUES (${req.body.repleNum}, ${req.body.memberNum}, ${req.body.boardNum}, '${req.body.repleContent}', ${req.body.groupId}, ${req.body.repleDepth}, ${req.body.childNums}, ${req.body.parentId})`, (err, rows) => {
        if(!err){
            res.send(true);
        }else res.send(false);
    })
});

router.post('/setReply', (req, res) => {
    maria.query('INSERT INTO reple (reple_num, member_num, board_num, reple_content, group_id, reple_depth, child_nums, parent_id) VALUES (' + 
        req.body.repleNum + ', ' + 
        req.body.memberNum + ', ' + 
        req.body.boardNum + ', ' + 
        `'${req.body.repleContent}', ${req.body.groupId}, ${req.body.repleDepth}, ${req.body.childNums}, ${req.body.parentId})`, (err, rows) => {
            if(!err){
                res.send(true);
            }else {
                console.log(err);
                res.send(false);
            }
        }
    )
});

router.post('/updateChildNums', (req, res) => {
    maria.query('UPDATE reple SET child_nums = child_nums + 1 WHERE reple_num = ' + req.body.repleNum , (err, rows) => {
        if(!err) {
            res.send(true);
        }else {
            console.log(err);
            res.send(false);
        }
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
    maria.query(`SELECT reple_num, r.member_num, board_num, reple_content, DATE_FORMAT(reple_regdate, '%Y-%m-%d') as reple_regdate, member_name, group_id, reple_depth, child_nums, parent_id FROM reple r JOIN member m ON r.member_num = m.member_num WHERE board_num = ${req.query.boardNum}`, (err, rows) => {
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
                    groupId : row.group_id,
                    repleDepth : row.reple_depth,
                    childNums : row.child_nums,
                    parentId : row.parent_id
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