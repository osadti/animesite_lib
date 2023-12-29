const Anime = require('../models/animeModels/anime');
const AnimeList = require('../models/animeModels/animeList');
const { AnimeGenre, AnimeStatus, AnimeType, AgeRating } = require('../models/animeModels/animeEntityModel');
const { handleMessage, handleSuccess, handleError } = require('../utils/messageHandling');

const models = {
    "AnimeStatus": {
        name: "status",
        model: AnimeStatus,
        message: {
            get: "Список статусов аниме",
            create: "Создан статус аниме",
            remove: "Удален статус аниме"
        },
        error: {
            get: "Статусы не найдены",
            create: "Ошибка создания статуса",
            remove: " Ошибка удаления статуса"
        }
    },
    "AnimeType": {
        name: "type",
        model: AnimeType,
        message: {
            get: "Список типов аниме",
            create: "Создан тип аниме",
            remove: "Удален тип аниме"
        },
        error: {
            get: "Типы не найдены",
            create: "Ошибка создания типа",
            remove: " Ошибка удаления типа"
        }
    },
    "AnimeGenre": {
        name: "genre",
        model: AnimeGenre,
        message: {
            get: "Список жанров аниме",
            create: "Создан жанр аниме",
            remove: "Удален жанр аниме"
        },
        error: {
            get: "Жанры не найдены",
            create: "Ошибка создания жанра",
            remove: " Ошибка удаления жанра"
        }
    },
    "AgeRating": {
        name: "ageRating",
        model: AgeRating,
        message: {
            get: "Список возрастных ограничений",
            create: "Создано возрастное ограничение аниме",
            remove: "Удален возрастное ограничение аниме"
        },
        error: {
            get: "Возрастные ограничения не найдены",
            create: "Ошибка создания возрастного ограничения",
            remove: " Ошибка удаления возрастного ограничения"
        }
    }
}


class AnimeController {
    constructor() {

    }

    //Anime
    async getAnime(req, res) {
        try {
            const { title } = req.params;
            if (title) {
                const anime = await Anime.findOne({ title: title });
                if (!anime) {
                    return handleError(res, 404, { message: 'Аниме с таким названием не найдено' })
                }
                return handleSuccess(res, 200, `Аниме ${title} найдено`, anime)
            }

            //Если title не предоставлен, возвращаем список всех аниме
            const allAnime = await Anime.find({});
            return handleSuccess(res, 200, "Список аниме", allAnime)
        } catch (error) {
            // Обрабатываем возможные ошибки при работе с базой данных
            console.error(error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async addAnime(req, res) {
        try {
            const anime = req.body.anime;
            console.log(anime);
            // Создаем экземпляр модели Anime с данными из тела запроса
            const newAnime = new Anime({
                anime_url: anime.anime_url,
                images: {
                    main_image: anime.images.main_image,
                    additional_images: anime.images.additional_images,
                    url_image: anime.images.url_image
                },
                title: anime.title,
                description: anime.description,
                release_date: anime.release_date,
                episodes: {
                    current: anime.episodes.current,
                    total: anime.episodes.total
                },
                type: anime.type,
                genres: anime.genres,
                status: anime.status,
                age_rating: anime.age_rating,
            });
            console.log(newAnime)
            console.log("newAnime: ", newAnime)

            const savedAnime = await newAnime.save();
            handleSuccess(res, 201, "Аниме добавлено", savedAnime)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    async searchAndFilterAnime(req, res) {
        try {
            // Получаем фильтры из запроса
            const { genre, type, status, ageRating, search } = req.query;

            console.log('type', type)

            // Строим объект запроса на основе фильтров
            let query = {};
            if (genre) {
                query.genres = { $in: [genre] };
            }
            if (type) {
                query.type = type;
            }
            if (status) {
                query.status = status;
            }
            if (ageRating) {
                query.age_rating = { $in: [ageRating] };
            }

            if (search) {
                query.title = { $regex: new RegExp(search, 'i') }; 
            }

            const animeList = await Anime.find(query);
            if (animeList.length === 0) {
                return handleError(res, 404, { message: 'Аниме не найдено' })
            }

            handleSuccess(res, 200, "Список аниме", animeList)
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка сервера' });
        }
    }

    // async updateAnime(req, res) {

    // }

    // async removeAnime(req, res) {

    // }


    //AnimeList


    //AgeRating, Genre, Type, Status
    async get(req, res, type_model) {
        try {
            //Получает массив жанров, типов, статусов
            const type_modelElements = await models[type_model].model.find()
            if (type_modelElements.length === 0) {
                return handleError(res, 404, models[type_model]['error']['get'])
            }
            const data = type_modelElements.map(elem => {
                return elem['name']
            })
            handleSuccess(res, 200, models[type_model]['message']['get'], data)
        } catch (error) {
            console.log(error);
            handleError(res, 500, "Ошибка сервера")
        }
    }

    async create(req, res, type_model) {
        try {
            //Получение названия Жанра, Типа, Статуса
            let { name, description } = req.body;

            if ((name == '' || name == null)) {
                return handleError(res, 400, 'Поле: name пустое')
            }

            if (type_model == 'AnimeGenre') {
                name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            }

            //Проверят есть ли Жанр, Тип, Статутс в базе чтобы не создавать его ещё раз
            const existingItem = await models[type_model].model.findOne({ name });

            if (existingItem) {
                return handleError(res, 400, `${models[type_model].name} с таким именем уже существует`)
            }
            // Создание нового Жанра, Типа, Статуса
            const newItem = new models[type_model].model({ name, description });
            await newItem.save();

            handleSuccess(res, 201, models[type_model]['message']['create'], { name, description })
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Ошибка сервера", error: error });
        }
    }

    async remove(req, res, type_model) {
        try {
            let { name, description } = req.body;

            if ((name == '' || name == null)) {
                return handleError(res, 400, 'Поле: name пустое')
            }

            if (type_model == 'AnimeGenre') {
                name = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
            }

            const item = await models[type_model].model.findOneAndDelete({ name })
            if (!item) {
                return handleError(res, 404, { message: `жанр не существует`, error: models[type_model]['error']['remove'], data: `${name}` })
            }
            handleSuccess(res, 200, models[type_model]['message']['remove'], name)
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Ошибка сервера", error: error });
        }
    }
}


module.exports = AnimeController;