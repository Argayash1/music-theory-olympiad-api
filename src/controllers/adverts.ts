// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import Advert from '../models/advert';

// Импорт статус-кодов ошибок
import {
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
  CAST_INCORRECT_ADVERTID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_ADVERT_MESSAGE,
  ADVERT_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '../utils/constants';

const { ValidationError, CastError } = Error;

const getAdverts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit ? Number(req.query.limit as string) : undefined;
    const sortBy = req.query.sortBy ? req.query.sortBy as string : undefined;
    const order = req.query.order === 'desc' ? -1 : 1;

    if (Number.isNaN(page) || Number.isNaN(limit)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    const filters: any = {};

    for (const [key, value] of Object.entries(req.query)) {
      if (key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'order') {
        filters[key] = { $regex: value as string, $options: 'i' };
      }
    }

    const totalAdvertsCount = await Advert.countDocuments();

    let advertQuery = Advert.find(filters);

    if (sortBy) {
      advertQuery = advertQuery.sort({ [sortBy]: order });
    }

    if (page && limit) {
      advertQuery = advertQuery.skip(skip).limit(limit);
    }

    const announcements = await advertQuery;

    res.send({
      data: announcements,
      totalPages: limit ? Math.ceil(totalAdvertsCount / limit) : undefined,
      total: totalAdvertsCount,
    });
  } catch (err) {
    next(err);
  }
};

const getAdvertById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { advertId } = req.params;
    const advert = await Advert.findById(advertId);
    if (!advert) {
      throw new NotFoundError(ADVERT_NOT_FOUND_ERROR_MESSAGE);
    }
    res.send({ data: advert });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_ADVERTID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

const createAdvert = async (req: Request, res: Response, next: NextFunction) => {
  const { createdAt, title, content, links } = req.body;
  try {
    const advert = await Advert.create({ createdAt, title, content, links });
    res.status(CREATED_201).send(advert);
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

const updateAdvertData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { advertId } = req.params;
    const { title, content, links } = req.body;

    // обновим имя найденного по _id пользователя
    const advert = await Advert.findByIdAndUpdate(
      advertId,
      { title, content, links }, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!advert) {
      throw new NotFoundError('Такого пользователя нет');
    }

    res.send(advert);
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
const deleteAdvertById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { advertId } = req.params;
    const advert = await Advert.findById(advertId);
    if (!advert) {
      throw new NotFoundError(ADVERT_NOT_FOUND_ERROR_MESSAGE);
    }
    await Advert.findByIdAndDelete(advertId);
    res.send({ message: DELETE_ADVERT_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_ADVERTID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export { getAdverts, getAdvertById, createAdvert, updateAdvertData, deleteAdvertById };
