const mongoose = require('mongoose');
const databaseName = 'AnimeDB';
const databaseURL = `mongodb://127.0.0.1:27017/${databaseName}`;

async function connect() {
    await mongoose.connect(databaseURL)
        .then(() => {
            console.log('Подключение к базе данных MongoDB установлено');
        })
        .catch((err) => {
            console.error('Ошибка подключения к базе данных MongoDB:', err);
        });
}

connect();

module.exports = mongoose.connection;