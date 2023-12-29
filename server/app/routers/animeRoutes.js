const express = require("express");
const router = express.Router();
const AnimeController = require('../controllers/animeController')

const animeController = new AnimeController();


//Anime

router.get('/anime/get_anime/:title?', animeController.getAnime)
router.post('/anime/add_anime', animeController.addAnime)
router.get('/anime/filter', animeController.searchAndFilterAnime);

// router.post('/anime/update_anime', animeController.updateAnime)
// router.post('/anime/remove_anime', animeController.removeAnime)


//Anime Type - Сериал, OVA, Film, ONA
router.get('/anime/get_types', (req, res) => animeController.get(req, res, 'AnimeType'));
router.post('/anime/create_type', (req, res) => animeController.create(req, res, 'AnimeType'))
router.post('/anime/remove_type', (req, res) => animeController.remove(req, res, 'AnimeType'))

// //Anime Genre - Повседневность, Меха
router.get('/anime/get_genres', (req, res) => animeController.get(req, res, 'AnimeGenre'));
router.post('/anime/create_genre', (req, res) => animeController.create(req, res, 'AnimeGenre'))
router.post('/anime/remove_genre', (req, res) => animeController.remove(req, res, 'AnimeGenre'))

// //Anime Status - Онгоинг, Вышло, Анонс
router.get('/anime/get_statuses', (req, res) => animeController.get(req, res, 'AnimeStatus'));
router.post('/anime/create_status', (req, res) => animeController.create(req, res, 'AnimeStatus'))
router.post('/anime/remove_status', (req, res) => animeController.remove(req, res, 'AnimeStatus'))

// //Anime AgeRating - Онгоинг, Вышло, Анонс
router.get('/anime/get_ageRatings', (req, res) => animeController.get(req, res, 'AgeRating'));
router.post('/anime/create_ageRating', (req, res) => animeController.create(req, res, 'AgeRating'))
router.post('/anime/remove_ageRating', (req, res) => animeController.remove(req, res, 'AgeRating'))


module.exports = router;
