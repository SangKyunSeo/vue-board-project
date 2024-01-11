const router = require("express").Router();
const bodyParser = require("body-parser");
const e = require("express");
const maria = require("../database/connect/maria");
router.use(bodyParser.json());

router.get("/getMyReaction", (req, res) => {
    maria.query(
        `SELECT * FROM reaction WHERE member_num = ${req.query.memberNum} AND board_num = ${req.query.boardNum}`,
        (err, rows) => {
            if (!err) {
                console.log("데이터 : " + rows.length);
                let reactVO = {};
                if (rows.length > 0) {
                    reactVO = {
                        reactionNum: rows[0].reaction_num,
                        reactionType: rows[0].reaction_type,
                        memberNum: rows[0].member_num,
                        boardNum: rows[0].board_num,
                    };
                }
                res.send(reactVO);
            } else console.log(err);
        }
    );
});

router.post("/insertMyReaction", (req, res) => {
    maria.query(
        `INSERT INTO reaction (reaction_type, member_num, board_num) VALUES (${req.body.reactionType}, ${req.body.memberNum}, ${req.body.boardNum})`,
        (err, rows) => {
            if (!err) res.send(true);
            else {
                console.log(err);
                res.send(false);
            }
        }
    );
});

router.post("/updateMyReaction", (req, res) => {
    maria.query(
        `UPDATE reaction SET reaction_type = ${req.body.reactionType} WHERE member_num = ${req.body.memberNum} AND board_num = ${req.body.boardNum} `,
        (err, rows) => {
            if (!err) res.send(true);
            else {
                console.log(err);
                res.send(false);
            }
        }
    );
});

router.get("/getReaction", (req, res) => {
    maria.query(
        `SELECT reaction_type, COUNT(*) AS reaction_count FROM reaction WHERE board_num = ${req.query.boardNum} GROUP BY reaction_type`,
        (err, rows) => {
            if (!err) {
                const reactionCountVO = [];
                for (let row of rows) {
                    reactionCountVO.push({
                        reactionType: row.reaction_type,
                        reactionCount: row.reaction_count,
                    });
                }
                console.log(reactionCountVO);
                res.send(reactionCountVO);
            } else console.log(err);
        }
    );
});

router.get("/myTodayReaction", (req, res) => {
    maria.query(
        `SELECT COUNT(*) as count FROM reaction r LEFT JOIN board b ON r.board_num = b.board_num WHERE DATE_FORMAT(b.board_regdate, '%Y-%m-%d') = CURDATE() AND r.member_num = ${req.query.memberNum}`,
        (err, rows) => {
            if (!err) {
                res.send(rows[0]);
            } else console.log(err);
        }
    );
});

module.exports = router;
