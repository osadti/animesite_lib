const mongoose = require('mongoose');

const animeSchema = new mongoose.Schema({
    anime_url: String,
    images: {
        main_image: String,
        additional_images: [String],
        url_image: String
    },
    title: {
        type: String,
        required: true,
    },
    description: String,
    release_date: Date,
    episodes: {
        current: Number,
        total: Number,
    },
    type: String,
    genres: [String],
    status: String,
    age_rating: [String],
    dubbing_types: [String],
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const Anime = mongoose.model('anime', animeSchema);

module.exports = Anime;
