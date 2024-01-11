const router = require("express").Router();
const bodyParser = require("body-parser");
const maria = require("../database/connect/maria");
const multer = require("multer");
const uuid4 = require("uuid4");
const path = require("path");
const fs = require("fs");

const upload = multer({
    storage: multer.diskStorage({
        filename(req, file, done) {
            const randomName = uuid4();
            const ext = path.extname(file.originalname);
            const fileName = randomName + ext;
            done(null, fileName);
        },
        destination(req, file, done) {
            done(null, "public/files");
        },
    }),
});

const uploadMiddleware = upload.fields([{ name: "userFile" }, { name: "boardNum" }]);

router.use(bodyParser.json());

router.post("/writeBoard", (req, res) => {
    const boardVO = {
        memberNum: req.body.memberNum,
        boardTitle: req.body.boardTitle,
        boardContent: req.body.boardContent,
        boardCategory: req.body.boardCategory,
        boardHit: 0,
    };

    maria.query(
        `INSERT INTO board (board_title, board_content, board_hit, board_category, member_num) ` +
            `VALUES ('${boardVO.boardTitle}','${boardVO.boardContent}',${boardVO.boardHit},${boardVO.boardCategory},${boardVO.memberNum})`,
        (err, results, rows) => {
            if (!err) {
                res.send({ msg: "success", boardNum: results.insertId });
                console.log("success");
                console.log(results.insertId);
            } else {
                console.log(err);
            }
        }
    );
});

router.get("/freeBoardList", (req, res) => {
    const boardVO = [];
    maria.query(
        "SELECT " +
            "b.board_num, board_title, board_content, board_hit, board_category, b.member_num, board_regdate, board_mdate, m.member_name, board_regdate, " +
            "COUNT(r.reple_num) as reple_count , f.fav_count " +
            "FROM board b " +
            "LEFT JOIN member m ON b.member_num = m.member_num " +
            "LEFT JOIN reple r on b.board_num = r.board_num " +
            "LEFT JOIN " +
            "(SELECT b.board_num, COUNT(f.fav_num) AS fav_count FROM board b LEFT JOIN fav f on b.board_num = f.board_num GROUP BY b.board_num) f " +
            "ON b.board_num = f.board_num " +
            "WHERE board_category = 1 GROUP BY b.board_num ORDER BY b.board_regdate DESC",
        (err, rows) => {
            if (!err) {
                for (let row of rows) {
                    boardVO.push({
                        boardNum: row.board_num,
                        boardTitle: row.board_title,
                        boardContent: row.board_content,
                        boardHit: row.board_hit,
                        boardCategory: row.board_category,
                        memberNum: row.member_num,
                        memberName: row.member_name,
                        boardRegdate: row.board_regdate,
                        boardMdate: row.board_mdate,
                        repleCount: row.reple_count,
                        favCount: row.fav_count,
                    });
                }
                res.send(boardVO);
            } else console.log(err);
        }
    );
});

router.get("/anonyBoardList", (req, res) => {
    const boardVO = [];
    maria.query(
        `SELECT b.board_num, board_title, board_content, board_hit, board_category, b.member_num, board_regdate, board_mdate, board_regdate, COUNT(r.reaction_num) AS reaction_count FROM board b LEFT JOIN reaction r ON b.board_num = r.board_num AND r.reaction_type != 0 WHERE board_category = 2 AND DATE_FORMAT(b.board_regdate,'%Y-%m-%d') = CURDATE() OR DATE_FORMAT(b.board_mdate,'%Y-%m-%d') = CURDATE() GROUP BY b.board_num ORDER BY b.board_regdate DESC`,
        (err, rows) => {
            if (!err) {
                for (let row of rows) {
                    boardVO.push({
                        boardNum: row.board_num,
                        boardTitle: row.board_title,
                        boardContent: row.board_content,
                        boardHit: row.board_hit,
                        boardCategory: row.board_category,
                        memberNum: row.member_num,
                        boardRegdate: row.board_regdate,
                        boardMdate: row.board_mdate,
                        reactionTotal: row.reaction_count,
                    });
                }
                res.send(boardVO);
            } else console.log(err);
        }
    );
});

router.get("/boardDetail", (req, res) => {
    maria.query(
        `SELECT * FROM board b JOIN member m ON b.member_num = m.member_num WHERE board_num = ${req.query.boardNum}`,
        (err, rows) => {
            if (!err) {
                const boardDetailVO = {
                    boardNum: rows[0].board_num,
                    boardTitle: rows[0].board_title,
                    boardContent: rows[0].board_content,
                    boardHit: rows[0].board_hit,
                    boardRegdate: rows[0].board_regdate,
                    boardMdate: rows[0].board_mdate,
                    memberNum: rows[0].member_num,
                    memberName: rows[0].member_name,
                };
                res.send(boardDetailVO);
            } else {
                console.log(err);
            }
        }
    );
});

router.get("/getImageFiles", (req, res) => {
    maria.query(`SELECT * FROM board_file WHERE board_num = ${req.query.boardNum}`, (err, rows) => {
        if (!err) {
            const imageListVO = [];
            for (let row of rows) {
                imageListVO.push({
                    fileName: row.file_name,
                    fileUrl: "http://localhost:3000/files/" + row.file_name,
                });
            }
            res.send(imageListVO);
        } else console.log(err);
    });
});

router.post("/addHit", (req, res) => {
    maria.query(`UPDATE board SET board_hit = board_hit + 1 WHERE board_num = ${req.body.boardNum}`, (err, rows) => {
        if (!err) res.send("true");
        else console.log(err);
    });
});

router.post("/updateBoard", (req, res) => {
    maria.query(
        `UPDATE board SET board_title = '${req.body.boardTitle}', board_content = '${req.body.boardContent}' WHERE board_num = ${req.body.boardNum}`,
        (err, rows) => {
            if (!err) res.send(true);
            else console.log(err);
        }
    );
});

router.get("/myFreeInterestTotal", (req, res) => {
    maria.query(
        `SELECT COUNT(*) AS count FROM (SELECT board_num from fav where member_num = ${req.query.memberNum} UNION SELECT board_num FROM reple WHERE member_num = ${req.query.memberNum} GROUP by board_num) s`,
        (err, rows) => {
            if (!err) {
                res.send(rows[0]);
            } else console.log(err);
        }
    );
});

router.post("/deleteBoard", (req, res) => {
    req.body.imageList.forEach((e) => {
        if (fs.existsSync("public/files/" + e.fileName)) {
            try {
                fs.unlinkSync("public/files/" + e.fileName);
            } catch (error) {
                console.log(error);
            }
        } else {
            console.log("/files/" + e.fileName);
        }
    });

    maria.query(
        `DELETE FROM board WHERE board_num = ${req.body.boardNum} AND member_num = ${req.body.memberNum}`,
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

// 파일 업로드
router.post("/uploadFile", uploadMiddleware, (req, res) => {
    console.log("파일" + req.files.userFile);
    console.log("데이터 " + req.body.boardNum);
    const imageUrlArray = [];
    req.files.userFile.forEach((e) => {
        imageUrlArray.push({
            imageUrl: "http://localhost:3000/files/" + e.filename,
        });
    });
    let sql = "INSERT INTO board_file (file_name, board_num) VALUES ?";
    let values = [];
    req.files.userFile.forEach((e) => {
        values.push([e.filename, req.body.boardNum]);
    });
    maria.query(sql, [values], (err, rows) => {
        if (!err) {
            console.log(values);
            res.send("success");
        } else {
            res.send("error");
            console.log(err);
        }
    });
});
module.exports = router;
