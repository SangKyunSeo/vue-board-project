const router = require("express").Router();
const maria = require("../database/connect/maria");
const bodyParser = require("body-parser");
router.use(bodyParser.json());

router.get("/getRepleNum", (req, res) => {
    maria.query("SELECT IFNULL(MAX(reple_num), 0) + 1 as reple_num FROM reple", (err, rows) => {
        if (!err) {
            const repleNum = rows[0].reple_num;
            res.send({ repleNum: repleNum });
        } else console.log(err);
    });
});

router.post("/writeReple", (req, res) => {
    maria.query(
        `INSERT INTO reple (reple_num, member_num, board_num, reple_content, group_id, reple_depth, child_nums, parent_id) VALUES (${req.body.repleNum}, ${req.body.memberNum}, ${req.body.boardNum}, '${req.body.repleContent}', ${req.body.groupId}, ${req.body.repleDepth}, ${req.body.childNums}, ${req.body.parentId})`,
        (err, rows) => {
            if (!err) {
                res.send(true);
            } else res.send(false);
        }
    );
});

router.post("/setReply", (req, res) => {
    maria.query(
        "INSERT INTO reple (reple_num, member_num, board_num, reple_content, group_id, reple_depth, child_nums, parent_id) VALUES (" +
            req.body.repleNum +
            ", " +
            req.body.memberNum +
            ", " +
            req.body.boardNum +
            ", " +
            `'${req.body.repleContent}', ${req.body.groupId}, ${req.body.repleDepth}, ${req.body.childNums}, ${req.body.parentId})`,
        (err, rows) => {
            if (!err) {
                res.send(true);
            } else {
                console.log(err);
                res.send(false);
            }
        }
    );
});

router.post("/updateChildNums", (req, res) => {
    maria.query("UPDATE reple SET child_nums = child_nums + 1 WHERE reple_num = " + req.body.repleNum, (err, rows) => {
        if (!err) {
            res.send(true);
        } else {
            console.log(err);
            res.send(false);
        }
    });
});

router.get("/getTodayRepleCount", (req, res) => {
    maria.query(
        `SELECT COUNT(*) AS count FROM reple WHERE member_num = ${req.query.memberNum} AND DATE_FORMAT(reple_regdate, '%Y/%m/%d') = '${req.query.today}'`,
        (err, rows) => {
            if (!err) {
                res.send(rows);
            } else console.log(err);
        }
    );
});

router.get("/getRepleList", (req, res) => {
    // maria.query(`
    // SELECT reple_num, r.member_num, board_num, reple_content, DATE_FORMAT(reple_regdate, '%Y-%m-%d') as reple_regdate, member_name, group_id, reple_depth, child_nums, parent_id
    // FROM reple r
    // JOIN member m ON r.member_num = m.member_num WHERE board_num = ${req.query.boardNum}`
    maria.query(
        `
    WITH RECURSIVE CTE AS (
        SELECT board_num, r.member_num, reple_num, parent_id, reple_content, DATE_FORMAT(reple_regdate, '%Y-%m-%d') as reple_regdate, member_name, group_id, reple_depth, CONVERT(reple_num, char) AS path FROM reple r JOIN member m ON r.member_num = m.member_num WHERE parent_id = 0 AND board_num = ${req.query.boardNum}
        UNION ALL 
        SELECT a.board_num, a.member_num, a.reple_num, a.parent_id, a.reple_content, DATE_FORMAT(a.reple_regdate, '%Y-%m-%d') as reple_regdate, m.member_name, a.group_id, a.reple_depth, CONCAT(path, '-', a.reple_num) AS path FROM reple a
        INNER JOIN CTE b ON a.parent_id = b.reple_num
        JOIN member m ON a.member_num = m.member_num
        WHERE a.board_num = ${req.query.boardNum} AND a.parent_id = b.reple_num
    )SELECT * FROM CTE ORDER BY CONVERT(SUBSTRING_INDEX(path, '-', 1), int)ASC, path ASC`,
        (err, rows) => {
            if (!err) {
                const repleVO = [];
                for (let row of rows) {
                    repleVO.push({
                        repleNum: row.reple_num,
                        memberNum: row.member_num,
                        boardNum: row.board_num,
                        repleContent: row.reple_content,
                        repleRegdate: row.reple_regdate,
                        memberName: row.member_name,
                        groupId: row.group_id,
                        repleDepth: row.reple_depth,
                        childNums: row.child_nums,
                        parentId: row.parent_id,
                    });
                }
                res.send(repleVO);
            } else console.log(err);
        }
    );
});

router.get("/getRepleTotalCount", (req, res) => {
    maria.query(`SELECT COUNT(*) AS count FROM reple WHERE board_num = ${req.query.boardNum}`, (err, rows) => {
        if (!err) {
            res.send(rows);
        } else console.log(err);
    });
});

module.exports = router;
