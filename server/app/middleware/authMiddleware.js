const jwt = require('jsonwebtoken');
const secretKey = 'shhhhh';

const verifyToken = (req, res, next) => {
    let authHeader = req.header('Authorization');
    token = authHeader && authHeader.split(' ')[1]; 
    console.log('token:', token);

    if (!token) {
        return res.status(401).json({ message: 'Доступ запрещен. Требуется токен.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Неверный токен.' });
    }
};

module.exports = verifyToken;
