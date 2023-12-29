const mongoose = require('mongoose');

const animeListSchema = new mongoose.Schema({
  main_anime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'anime', 
    required: true,
  },
  entries: [
    {
      anime: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'anime',
        required: true,
      },
    },
  ],
});

const AnimeList = mongoose.model('anime_lists', animeListSchema);

module.exports = AnimeList;
