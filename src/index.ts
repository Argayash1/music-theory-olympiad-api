// Импорт npm-пакетов
import express from 'express';
import mongoose from 'mongoose';

import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import errorHandler from './middlwares/errorHandler';
import limiter from './middlwares/limiter';
import { errorLogger, requestLogger } from './middlwares/logger';

import router from './routes/index';
import helmet from 'helmet';
import corsHandler from './middlwares/corsHandler';

const { PORT = 3001 } = process.env;

const app = express();

const options = {
  useNewUrlParser: true,
} as mongoose.ConnectOptions;

mongoose.connect('mongodb://127.0.0.1:27017/musictheoryolympiaddb', options);

// Миддлвэр для логирования запросов
app.use(requestLogger); // подключаем логгер запросов

// Миддлвэры для безопасности (лимитер, хельмет и корс-обработчик)
app.use(limiter);
app.use(helmet());
app.use(corsHandler);

// Миддлвэры для парсинга
app.use(express.json()); // для собирания JSON-формата
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // подключаем парсер кук как мидлвэр

// Роутер
app.use(router);

// Миддлвэры для обработки ошибок
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler); // централизолванная обработка ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
