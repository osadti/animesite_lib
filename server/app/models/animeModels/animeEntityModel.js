const mongoose = require('mongoose');

const baseSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  description: String,
});

function createModelForCollection(collectionName) {
  return mongoose.model(collectionName, baseSchema);
}

const AnimeGenre = createModelForCollection('anime_genres');
const AnimeStatus = createModelForCollection('anime_statuses');
const AnimeType = createModelForCollection('anime_types');
const AgeRating = createModelForCollection('age_ratings');
const DubbingType = createModelForCollection('dubbing_types');

module.exports = {
  AnimeGenre,
  AnimeStatus,
  AnimeType,
  AgeRating,
  DubbingType
};
