// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import PrepMaterial from '../models/prepMaterial';

// Импорт статус-кодов ошибок
import {
  CAST_INCORRECT_PREPMATERIALID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_PREPMATERIAL_MESSAGE,
  PREPMATERIAL_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
} from '../utils/constants';

const { ValidationError, CastError } = Error;

const getPrepMaterials = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit ? Number(req.query.limit as string) : undefined;

    if (Number.isNaN(page) || Number.isNaN(limit)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalPrepMaterialsCount = await PrepMaterial.countDocuments();

    let prepMaterialsQuery = PrepMaterial.find();

    if (page && limit) {
      prepMaterialsQuery = prepMaterialsQuery.skip(skip).limit(limit);
    }

    const prepMaterials = await prepMaterialsQuery;

    res.send({
      data: prepMaterials,
      totalPages: limit ? Math.ceil(totalPrepMaterialsCount / limit) : undefined,
    });
  } catch (err) {
    next(err);
  }
};

const getPrepMaterialById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prepMaterialId } = req.params;
    const prepMaterial = await PrepMaterial.findById(prepMaterialId);
    if (!prepMaterial) {
      throw new NotFoundError(PREPMATERIAL_NOT_FOUND_ERROR_MESSAGE);
    }
    res.send({ data: prepMaterial });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_PREPMATERIALID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

const createPrepMaterial = async (req: Request, res: Response, next: NextFunction) => {
  const { category, dictations, soundAnalysis, harmonization, solfeggio } = req.body;
  try {
    const prepMaterial = await PrepMaterial.create({ category, dictations, soundAnalysis, harmonization, solfeggio });
    res.status(CREATED_201).send(prepMaterial);
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

const updatePrepMaterialData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prepMaterialId } = req.params;
    const { category, dictations, soundAnalysis, harmonization, solfeggio } = req.body;

    // обновим имя найденного по _id пользователя
    const prepMaterial = await PrepMaterial.findByIdAndUpdate(
      prepMaterialId,
      { category, dictations, soundAnalysis, harmonization, solfeggio }, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!prepMaterial) {
      throw new NotFoundError('Такого пользователя нет');
    }

    res.send(prepMaterial);
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
const deletePrepMaterialById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prepMaterialId } = req.params;
    const prepMaterial = await PrepMaterial.findById(prepMaterialId);
    if (!prepMaterial) {
      throw new NotFoundError(PREPMATERIAL_NOT_FOUND_ERROR_MESSAGE);
    }
    await PrepMaterial.findByIdAndDelete(prepMaterialId);
    res.send({ message: DELETE_PREPMATERIAL_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_PREPMATERIALID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export { getPrepMaterials, getPrepMaterialById, createPrepMaterial, updatePrepMaterialData, deletePrepMaterialById };
