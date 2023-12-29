const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3000;
const mongooseConnection = require('./config/database');

const userRoute = require('./app/routers/userRoutes');
const animeRoute = require('./app/routers/animeRoutes');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Разрешаем все источники
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Разрешаем методы
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Разрешаем заголовки
    next();
});

app.use(express.json());
app.use('/api', userRoute);
app.use('/api', animeRoute);

function start() {
    app.get('/', (req, res) => {
        res.send('Привет, мир!');
    });

    app.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
    });
}

start()