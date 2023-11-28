const express = require('express');
const cors = require('cors');
const app = express();
const register = require('./Register/register');
const login = require('./Login/login');
const maria = require('./database/connect/maria');
const main = require('./Board/Main/main');
const board = require('./Board/board');
const fav = require('./Fav/fav');
const attend = require('./attend/attend');
const point = require('./point/point');
const reple = require('./reple/reple');

maria.connect();

app.use(cors());
app.use('/api/register', register);
app.use('/api/login', login);
app.use('/api/main', main);
app.use('/api/board', board);
app.use('/api/fav', fav);
app.use('/api/attend', attend);
app.use('/api/point', point);
app.use('/api/reple', reple);


app.listen(3000, () => {
    console.log('sever start');
})