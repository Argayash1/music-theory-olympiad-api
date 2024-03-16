// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import JuruMember from '../models/juryMember';

// Импорт статус-кодов ошибок
import {
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
  CAST_INCORRECT_MEMBERID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_PROJECT_MESSAGE,
  PROJECT_NOT_FOUND_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '../utils/constants';

const { ValidationError, CastError } = Error;

interface IMember {
  imageUrl?: string;
  surname?: string;
  patronymic?: string;
  name?: string;
  about?: string;
  link?: string;
}

// Функция, которая возвращает все новости
const getJuryMembers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = req.query.page ? Number(req.query.page as string) : undefined;
    const limit = req.query.limit ? Number(req.query.limit as string) : undefined;

    if (Number.isNaN(page) || Number.isNaN(limit)) {
      throw new BadRequestError(BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE);
    }

    const skip = page && limit ? (page - 1) * limit : 0;

    const totalJuryMembersCount = await JuruMember.countDocuments();

    let juryMembersQuery = JuruMember.find();

    if (page && limit) {
      juryMembersQuery = juryMembersQuery.skip(skip).limit(limit);
    }

    const members = await juryMembersQuery;

    res.send({
      data: members,
      totalPages: limit ? Math.ceil(totalJuryMembersCount / limit) : undefined,
    });
  } catch (err) {
    next(err);
  }
};

const getJuryMemberById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memberId } = req.params;
    const juryMember = await JuruMember.findById(memberId);
    if (!juryMember) {
      throw new NotFoundError(PROJECT_NOT_FOUND_ERROR_MESSAGE);
    }
    res.send({ data: juryMember });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_MEMBERID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

const createJuryMember = async (req: Request, res: Response, next: NextFunction) => {
  const { imageUrl, surname, patronymic, name, about, link } = req.body;
  try {
    const juryMember = await JuruMember.create({
      imageUrl,
      surname,
      patronymic,
      name,
      about,
      link,
    });
    res.status(CREATED_201).send(juryMember);
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

const updateJuryMemberData = async (req: Request, res: Response, next: NextFunction, memberData: IMember) => {
  try {
    const { memberId } = req.params;
    // обновим имя найденного по _id пользователя
    const juryMember = await JuruMember.findByIdAndUpdate(
      memberId,
      memberData, // Передадим объект опций:
      {
        new: true, // обработчик then получит на вход обновлённую запись
        runValidators: true, // данные будут валидированы перед изменением
      },
    );

    if (!juryMember) {
      throw new NotFoundError('Такого пользователя нет');
    }

    res.send(juryMember);
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

const updateJuryMemberInfo = (req: Request, res: Response, next: NextFunction) => {
  const { surname, patronymic, name, about, link } = req.body;
  updateJuryMemberData(req, res, next, { surname, patronymic, name, about, link });
};

const updateJuryMemberImage = (req: Request, res: Response, next: NextFunction) => {
  const { imageUrl } = req.body;
  updateJuryMemberData(req, res, next, { imageUrl });
};

// Функция, которая удаляет новость по идентификатору
const deleteUnionMemberById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memberId } = req.params;
    const juryMember = await JuruMember.findById(memberId);
    if (!juryMember) {
      throw new NotFoundError(PROJECT_NOT_FOUND_ERROR_MESSAGE);
    }
    await JuruMember.findByIdAndDelete(memberId);
    res.send({ message: DELETE_PROJECT_MESSAGE });
  } catch (err) {
    if (err instanceof CastError) {
      next(new BadRequestError(CAST_INCORRECT_MEMBERID_ERROR_MESSAGE));
    } else {
      next(err);
    }
  }
};

export {
  getJuryMembers,
  getJuryMemberById,
  updateJuryMemberInfo,
  updateJuryMemberImage,
  createJuryMember,
  deleteUnionMemberById,
};
