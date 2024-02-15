// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import MusOlympData from '../models/musOlympData';

// Импорт статус-кодов ошибок
import {
  CAST_INCORRECT_AUDIOID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_AUDIO_MESSAGE,
  AUDIO_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '../utils/constants';

const { ValidationError, CastError } = Error;

const getMusOlympData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const musOlympData = await MusOlympData.find({});
    const totalmusOlympDataCount = await MusOlympData.countDocuments({});

    res.send({
      data: musOlympData,
      totalPages: totalmusOlympDataCount ? 1 : undefined,
    });
  } catch (err) {
    next(err);
  }
};

const createMusOlympData = async (req: Request, res: Response, next: NextFunction) => {
  const { olympNumber, dates, registrationDates, city, topic, participants } = req.body;
  try {
    const musOlympData = await MusOlympData.create({
      olympNumber,
      dates,
      registrationDates,
      city,
      topic,
      participants,
    });
    res.status(CREATED_201).send(musOlympData);
  } catch (err) {
    if (err instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(', ');
      next(new BadRequestError(`${VALIDATION_ERROR_MESSAGE} ${errorMessage}`));
    } else {
      next(err);
    }
  }
};

const updateMusOlympData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { musOlympId } = req.params;
    const { olympNumber, dates, registrationDates, city, topic, participants } = req.body;
    // обновим имя найденного по _id пользователя
    const musOlympData = await MusOlympData.findByIdAndUpdate(
      musOlympId,
      { olympNumber, dates, registrationDates, city, topic, participants }, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!musOlympData) {
      throw new NotFoundError('Такого пользователя нет');
    }

    res.send(musOlympData);
  } catch (err) {
    if (err instanceof ValidationError) {
      const errorMessage = Object.values(err.errors)
        .map((error) => error.message)
        .join(', ');
      next(new BadRequestError(`Некорректные данные: ${errorMessage}`));
      return;
    }
    if (err instanceof CastError) {
      next(new BadRequestError('Некорректный Id пользователя'));
    } else {
      next(err);
    }
  }
};

// Функция, которая удаляет новость по идентификатору
const deleteMuseOlympDataById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { musOlympId } = req.params;
    const musOlympData = await MusOlympData.findById(musOlympId);
    console.log(musOlympData);
    if (!musOlympData) {
      throw new NotFoundError(AUDIO_NOT_FOUND_ERROR_MESSAGE);
    }
    await MusOlympData.findByIdAndDelete(musOlympId);
    res.send({ message: DELETE_AUDIO_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_AUDIOID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export { getMusOlympData, createMusOlympData, updateMusOlympData, deleteMuseOlympDataById };
