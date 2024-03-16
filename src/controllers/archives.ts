// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import Archive from '../models/archive';

// Импорт статус-кодов ошибок
import {
  CAST_INCORRECT_ARCHIVEID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_ARCHIVE_MESSAGE,
  ARCHIVE_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
} from '../utils/constants';

const { ValidationError, CastError } = Error;

const getArchives = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = req.query.category ? Number(req.query.category as string) : undefined;
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit ? Number(req.query.limit as string) : undefined;

    if (Number.isNaN(page) || Number.isNaN(limit) || Number.isNaN(category)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    let query = {};

    if (category) {
      query = { category: category };
    }

    const totalArchivesCount = await Archive.countDocuments(query);

    let archivesQuery = Archive.find(query);

    if (page && limit) {
      archivesQuery = archivesQuery.skip(skip).limit(limit);
    }

    const archives = await archivesQuery;

    res.send({
      data: archives,
      totalPages: limit ? Math.ceil(totalArchivesCount / limit) : undefined,
    });
  } catch (err) {
    next(err);
  }
};

const getArchiveById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { archiveId } = req.params;
    const archive = await Archive.findById(archiveId);
    res.send({ data: archive });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_ARCHIVEID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

const createArchive = async (req: Request, res: Response, next: NextFunction) => {
  const { year, category, dictations, soundAnalysis, harmonization, solfeggio } = req.body;
  try {
    const archive = await Archive.create({ year, category, dictations, soundAnalysis, harmonization, solfeggio });
    res.status(CREATED_201).send(archive);
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

const updateArchiveData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { archiveId } = req.params;
    const { year, category, dictations, soundAnalysis, harmonization, solfeggio } = req.body;

    // обновим имя найденного по _id пользователя
    const archive = await Archive.findByIdAndUpdate(
      archiveId,
      { year, dictations, category, soundAnalysis, harmonization, solfeggio }, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!archive) {
      throw new NotFoundError('Такого пользователя нет');
    }

    res.send(archive);
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
const deleteArchiveById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { archiveId } = req.params;
    const archive = await Archive.findById(archiveId);
    if (!archive) {
      throw new NotFoundError(ARCHIVE_NOT_FOUND_ERROR_MESSAGE);
    }
    await Archive.findByIdAndDelete(archiveId);
    res.send({ message: DELETE_ARCHIVE_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_ARCHIVEID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export { getArchives, getArchiveById, createArchive, updateArchiveData, deleteArchiveById };
