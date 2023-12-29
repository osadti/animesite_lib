const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true, 
    },
    username: {
        type: String,
        required: true, 
        unique: true,   
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    animeList_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user_anime_list'
    }
}, {});

const User = mongoose.model('users', userSchema);

module.exports = User;
