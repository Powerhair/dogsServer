const express = require("express");
const mongoose = require("mongoose");

// Подключение к базе данных
mongoose.connect("mongodb://localhost:27017/dogbreeds", {});

// Определение схемы данных
const dogBreedSchema = new mongoose.Schema({
  nameEn: String,
  nameRu: String,
  imagePath: String,
  description: String,
  height: String,
});

// Определение модели
const DogBreed = mongoose.model("DogBreed", dogBreedSchema);

// Создание экземпляра приложения Express.js
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Получение всех пород
app.get("/dogbreeds", (req, res) => {
  DogBreed.find()
    .then((dogBreeds) => {
      res.json(dogBreeds);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Произошла ошибка сервера");
    });
});

// Получение названия всех пород на английском языке
app.get("/dogbreeds/namesEn", (req, res) => {
  DogBreed.find({}, "nameEn")
    .then((dogBreeds) => {
      const dogBreedNames = dogBreeds.map((breed) => breed.nameEn);
      res.json(dogBreedNames);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Произошла ошибка сервера");
    });
});

// Получение названия всех пород на русском языке
app.get("/dogbreeds/namesRu", (req, res) => {
  DogBreed.find({}, "nameRu")
    .then((dogBreeds) => {
      const dogBreedNames = dogBreeds.map((breed) => breed.nameRu);
      res.json(dogBreedNames);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Произошла ошибка сервера");
    });
});

// Получение трех случайных пород
app.get("/dogbreeds/random", (req, res) => {
  DogBreed.aggregate([{ $sample: { size: 3 } }])
    .then((dogBreeds) => {
      res.json(dogBreeds);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Произошла ошибка сервера");
    });
});

// Получение информации о породе и фотографии по ее имени
app.get("/dogbreeds/:name", (req, res) => {
  const breedName = req.params.name;
  DogBreed.findOne({ nameEn: breedName })
    .then((dogBreed) => {
      res.json(dogBreed);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Произошла ошибка сервера");
    });
});

// Запуск сервера
app.listen(3000, () => {
  console.log("Сервер запущен на порту 3000");
});
