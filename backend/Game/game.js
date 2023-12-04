const router = require('express').Router();
const bodyParser = require('body-parser');
const maria = require('../database/connect/maria');

router.use(bodyParser.json());

// 게임 목록
router.get('/getGameList', (req, res) => {
    maria.query(`SELECT * FROM game ORDER BY game_regdate DESC`, (err, rows) => {
        if(!err){
            const gameVO = [];
            for(let row of rows){
                gameVO.push({
                    gameNum : row.game_num,
                    gameTitle : row.game_title,
                    gameContent : row.game_content,
                    gamePrice : row.game_price,
                    gameCost : row.game_cost,
                    gameRegdate : row.game_regdate
                });
            }
            console.log(gameVO);
            res.send(gameVO);
        }
    });
});

// 게임 상세
router.get('/getGameDetail', (req, res) => {
    maria.query(`SELECT * FROM game WHERE game_num = ${req.query.gameNum}`, (err, rows) => {
        if(!err){
            const gameDetailVO = {
                gameNum : rows[0].game_num,
                gameTitle : rows[0].game_title,
                gameContent : rows[0].game_content,
                gamePrice : rows[0].game_price,
                gameCost : rows[0].game_cost,
                gameRegdate : rows[0].game_regdate
            };
            res.send(gameDetailVO);
        }else console.log(err);
    })
});

module.exports = router;