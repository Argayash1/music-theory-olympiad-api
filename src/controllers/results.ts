// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import Result from '../models/result';

// Импорт статус-кодов ошибок
import {
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
  BAD_REUEST_INCORRECT_RESULTINDEX_ERROR_MESSAGE,
  CAST_INCORRECT_RESULTID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_RESULT_MESSAGE,
  RESULT_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '../utils/constants';

const { ValidationError, CastError } = Error;

const getResults = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit ? Number(req.query.limit as string) : undefined;

    if (Number.isNaN(page) || Number.isNaN(limit)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalResultsCount = await Result.countDocuments();

    let resultsQuery = Result.find();

    if (page && limit) {
      resultsQuery = resultsQuery.skip(skip).limit(limit);
    }

    const results = await resultsQuery;

    res.send({
      data: results,
      totalPages: limit ? Math.ceil(totalResultsCount / limit) : undefined,
    });
  } catch (err) {
    next(err);
  }
};

const getResultByIndex = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const results = await Result.find({});
    const resultIndex = parseInt(req.params.resultIndex); // Извлечение resultIndex из URL-адреса и преобразование в число

    if (isNaN(resultIndex) || resultIndex >= results.length) {
      // Проверка валидности resultIndex
      throw new BadRequestError(BAD_REUEST_INCORRECT_RESULTINDEX_ERROR_MESSAGE);
    }

    const result = results[resultIndex]; // Получение отчёта из массива по индексу

    res.send(result);
  } catch (err) {
    next(err);
  }
};

const createResult = async (req: Request, res: Response, next: NextFunction) => {
  const { category, url } = req.body;
  try {
    const result = await Result.create({ category, url });
    res.status(CREATED_201).send(result);
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

const updateResultData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resultId } = req.params;
    const { category, url } = req.body;

    // обновим имя найденного по _id пользователя
    const result = await Result.findByIdAndUpdate(
      resultId,
      { category, url }, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!result) {
      throw new NotFoundError('Такого пользователя нет');
    }

    res.send(result);
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
const deleteResultById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resultId } = req.params;
    const result = await Result.findById(resultId);
    if (!result) {
      throw new NotFoundError(RESULT_NOT_FOUND_ERROR_MESSAGE);
    }
    await Result.findByIdAndDelete(resultId);
    res.send({ message: DELETE_RESULT_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_RESULTID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export { getResults, getResultByIndex, createResult, updateResultData, deleteResultById };
