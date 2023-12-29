const mongoose = require('mongoose');

const userAnimeListSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    watching: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'anime',
    }],
    planToWatch: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'anime',
    }],
    completed: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'anime',
    }],
    dropped: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'anime',
    }],
    listType: {
        type: String,
        enum: ['public', 'private', 'custom'],
        default: 'private',
    },
    userAccess: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    }],
});

const UserAnimeList = mongoose.model('user_anime_list', userAnimeListSchema);

module.exports = UserAnimeList;
