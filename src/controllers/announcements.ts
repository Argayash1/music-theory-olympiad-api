// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import Announcement from '../models/announcement';

// Импорт статус-кодов ошибок
import {
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
  CAST_INCORRECT_NEWSID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_NEWS_MESSAGE,
  NEWS_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '../utils/constants';

const { ValidationError, CastError } = Error;

const getAnnouncements = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit ? Number(req.query.limit as string) : undefined;

    if (Number.isNaN(page) || Number.isNaN(limit)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalAnnouncementsCount = await Announcement.countDocuments();

    let announcementQuery = Announcement.find();

    if (page && limit) {
      announcementQuery = announcementQuery.skip(skip).limit(limit);
    }

    const announcements = await announcementQuery;

    res.send({
      data: announcements,
      totalPages: limit ? Math.ceil(totalAnnouncementsCount / limit) : undefined,
    });
  } catch (err) {
    next(err);
  }
};

const getAnnouncementById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { announcementId } = req.params;
    const announcement = await Announcement.findById(announcementId);
    res.send({ data: announcement });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_NEWSID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

const createAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
  const { createdAt, title, content } = req.body;
  try {
    const announcement = await Announcement.create({ createdAt, title, content });
    res.status(CREATED_201).send(announcement);
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

const updateAnnouncementData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { announcementId } = req.params;
    const { title, content } = req.body;

    // обновим имя найденного по _id пользователя
    const announcement = await Announcement.findByIdAndUpdate(
      announcementId,
      { title, content }, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!announcement) {
      throw new NotFoundError('Такого пользователя нет');
    }

    res.send(announcement);
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
const deleteAnnouncementById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { announcementId } = req.params;
    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      throw new NotFoundError(NEWS_NOT_FOUND_ERROR_MESSAGE);
    }
    await Announcement.findByIdAndDelete(announcementId);
    res.send({ message: DELETE_NEWS_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_NEWSID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export { getAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncementData, deleteAnnouncementById };
