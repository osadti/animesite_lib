const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    description: String,
});

const UserRole = mongoose.model('user_roles', userRoleSchema);

module.exports = UserRole;