const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = 'shhhhh';

const User = require('../models/userModels/user');
const UserRole = require('../models/userModels/userRole');
const UserAnimeList = require('../models/userModels/userAnimeList');
const { handleMessage, handleSuccess, handleError } = require('../utils/messageHandling')


class UserController {
    constructor() {

    }

    static get getRoles() {
        return { ADMIN: 'ADMIN', ORDINARY: 'ORDINARY', MODERATOR: 'MODERATOR' }
    }

    async getUsers(req, res) {
        try {
            const body = req.body;
            const { role, start_user_id, limit } = body;

            let query = {};

            if (role) {
                query.role = role;
            }

            console.log('role: ', role)
            console.log('start_user_id: ', start_user_id)
            console.log('limit: ', limit)

            const users = await User.find(query)
                .skip(start_user_id - 1)
                .limit(limit);

            console.log('users: ', users)

            if (users.length === 0) {
                return res.status(404).json({ message: 'Пользователи не найдены' });
            }
            console.log('Получено пользователей:', users);
            res.status(200).json(users);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async getUser(req, res) {
        try {
            let user_id = req.params.id;
            if(user_id == null || user_id == undefined){
                user_id = req.user.id;
            }
            console.log('ididiid', user_id)

            const user = await User.findOne({ user_id });
            if (!user) {
                console.log('Пользователя с таким id нет:', user_id);
                return res.status(404).json({ message: 'Пользователя с таким id не существует', id: user_id })
            }

            handleSuccess(res, 200, 'Пользователь найден', user)
        } catch (error) {
            console.error('Ошибка при поиске пользователя:', error);
        }
    }

    async loginUser(req, res) {
        try {
            const user = req.body.user;

            console.log('user:', user);

            const findUser = await User.findOne({ username: user.username });

            if (!findUser) {
                return res.status(404).json({ message: `Пользователь с таким логином: ${user.username} не найден` })
            }

            console.log('findUser:', findUser);

            const pass = await bcrypt.compare(user.password, findUser.password);

            console.log('pass:', pass);

            if (pass === true) {
                const token = jwt.sign({ id: findUser.user_id, username: findUser.username }, secretKey, { expiresIn: '5m' })
                return handleSuccess(res, 201, `Вход успешен!`, token)
            }

            handleError(res, 400, 'Ошибка авторизации!');
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }

    }

    async createUser(req, res) {
        try {
            const { name, username, password } = req.body;

            if (name == '' || username == '' || password == '') {
                return handleError(req, res, 400, 'Заполните все обязательные поля!');
            }

            const user = await User.findOne({ username: username })
            if (user) {
                console.log(user);
                return res.status(200).json({ message: `Пользователь с таким username: ${username} существует` })
            }

            // console.log(req.body)

            // return res.send('321321')

            const hash = await bcrypt.hash(password, 7);
            const role = UserController.getRoles['ORDINARY'];
            const lastUser = await User.findOne().sort({ user_id: -1 });
            const user_id = lastUser ? lastUser.user_id + 1 : 1;
            const lastUserAnimeList = await UserAnimeList.findOne().sort({ id: -1 });
            const UserAnimeList_id = lastUserAnimeList ? lastUserAnimeList.id + 1 : 1;

            const newUserAnimeList = new UserAnimeList({
                id: UserAnimeList_id
            })

            const newUser = new User({
                user_id,
                name,
                username,
                role,
                password: hash,
                animeList_id: newUserAnimeList._id
            })

            const token = jwt.sign({ user_id, username }, secretKey, { expiresIn: '10m' });

            const savedUser = await newUser.save();
            const savedUserAnimeList = await newUserAnimeList.save();
            console.log('Пользователь успешно создан:', savedUser);
            console.log('Список аниме успешно создан:', savedUserAnimeList);
            return handleSuccess(res, 201, `Пользователь ${username} успешно добавлен!`, token)
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async updateUser(req, res) {
        try {
            const user = req.body.user;

            console.log(user);

            const updatedUser = await User.findOneAndUpdate(
                { user_id: user['user_id'] },
                { username: user.username, name: user.name },
                { new: true }
            );

            console.log(updatedUser);

            if (!updatedUser) {
                return res.status(404).json({ message: 'Пользователь не найден' });
            }

            res.status(200).json({ message: "Данные пользователя обновлены!", content: updatedUser })
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Ошибка сервера", content: err })
        }
    }

    async removeUser(req, res) {
        try {
            const { user_id, username } = req.body;
            const user = await User.findOne({ username, user_id })

            console.log(user);

            if (!user) {
                return res.status(404).json({ message: "Пользователя не найдено или не правильные параметры запроса", content: req.body });
            }

            console.log(user.username);

            const response = await User.deleteOne({ username: user.username, user_id: user.user_id })
            res.status(200).json({ message: `Пользователь ${user.username} удалён`, content: response });
            // res.send('dsadsa')
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Ошибка обработки сервера", content: err });
        }


    }

    async getRoles(req, res) {
        try {
            const roles = await UserRole.find();
            if (roles.length == 0) {
                return handleMessage(res, 404, 'Роли не существуют!', 'message')
            }
            console.log('Роли', roles);
            res.status(200).json(roles);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Ошибка сервера при создании роли' });
        }
    }

    async createRole(req, res) {
        try {
            let { role_name, description } = req.body;
            role_name = role_name.toUpperCase();
            const roles = UserController.getRoles;

            if ((role_name == null || role_name == '') || (!roles[role_name])) {
                return handleError(req, res, 400, 'Поле role_name пустое или не существующию роль.');
            }

            console.log(role_name)
            console.log(description)

            await UserRole.findOne({ name: role_name })
                .then(async role => {
                    console.log(role)
                    if (!role) {
                        const newRole = new UserRole({
                            name: role_name,
                            description
                        })
                        const savedRole = await newRole.save();
                        return handleSuccess(res, 201, 'Роль успешно создана!', savedRole)
                    }
                    return handleSuccess(res, 200, 'Роль существует!', role_name)
                })
                .catch(err => {
                    return handleError(req, res, 500, err)
                })
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async removeRoleByName(req, res) {
        try {
            let { role_name } = req.body;
            const roles = UserController.getRoles;
            role_name = role_name.toUpperCase();
            if (roles[role_name]) {
                const role = await UserRole.findOne({ name: role_name });
                if (role) {
                    await UserRole.deleteOne({ name: role.name });
                    return handleMessage(res, 200, `Роль ${role.name} удалена`, 'message');
                }
            }
            return handleMessage(res, 200, `Роль ${role_name} не найдена`, 'message');
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }


}




module.exports = UserController;

// GET /users: Получить список всех пользователей.
// GET /users/:id: Получить информацию о конкретном пользователе по ID.
// POST /users: Создать нового пользователя.
// PUT /users/:id: Обновить информацию о пользователе по ID.
// DELETE /users/:id: Удалить пользователя по ID.

// GET /user-roles: Получить список всех ролей пользователей.
// POST /user-roles: Создать новую роль пользователя.
// DELETE /user-roles/:id: Удалить роль пользователя по ID.

// GET /users/:userId/lists: Получить список аниме-списков конкретного пользователя.
// GET /users/:userId/lists/:listId: Получить информацию о конкретном списке аниме пользователя.
// PUT /users/:userId/lists/:listId: Обновить информацию о списке аниме пользователя.
// DELETE /users/:userId/lists/:listId: Удалить список аниме пользователя.