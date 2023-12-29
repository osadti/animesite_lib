const express = require("express");
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware')
const UserController = require('../controllers/userController')

const userController = new UserController();

router.post('/users/login_user', userController.loginUser)
router.post('/users/register_user', userController.createUser)

router.post('/users/get_users', verifyToken, userController.getUsers)
router.get('/users/get_user/:id?', verifyToken, userController.getUser)

router.put('/users/update_user', verifyToken, userController.updateUser)
router.post('/users/remove_user', verifyToken, userController.removeUser)

router.get('/users/get_roles', verifyToken, userController.getRoles)
router.post('/users/create_role', verifyToken, userController.createRole)
router.post('/users/remove_role', verifyToken, userController.removeRoleByName)


module.exports = router;


// GET /users: Получить список всех пользователей.
// GET /users/:id: Получить информацию о конкретном пользователе по ID.
// POST /users: Создать нового пользователя.
// PUT /users/:id: Обновить информацию о пользователе по ID.
// DELETE /users/:id: Удалить пользователя по ID.

// GET /user-roles: Получить список всех ролей пользователей.
// POST /user-roles: Создать новую роль пользователя.
// POST /user-roles: Удалить роль пользователя по name.

// GET /users/:userId/lists: Получить список аниме-списков конкретного пользователя.
// GET /users/:userId/lists/:listId: Получить информацию о конкретном списке аниме пользователя.
// POST /users/:userId/lists: Создать новый список аниме для пользователя.
// PUT /users/:userId/lists/:listId: Обновить информацию о списке аниме пользователя.
// DELETE /users/:userId/lists/:listId: Удалить список аниме пользователя.