const router = require('express').Router();
const bodyParser = require('body-parser');
const maria = require('../database/connect/maria');

router.use(bodyParser.json());

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
})

module.exports = router;