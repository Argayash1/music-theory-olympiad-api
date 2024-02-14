// Импорт npm-пакетов
import express from 'express';
import mongoose from 'mongoose';

const { PORT = 3001 } = process.env;

const app = express();

const options = {
  useNewUrlParser: true,
} as mongoose.ConnectOptions;

mongoose.connect('mongodb://127.0.0.1:27017/musictheoryolympiaddb', options);

// Миддлвэры для парсинга
app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
