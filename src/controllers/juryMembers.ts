// Импорт типов из express
import { Request, Response, NextFunction } from 'express';

// Импорт классов ошибок из mongoose.Error
import { Error } from 'mongoose';

// Импорт классов ошибок из конструкторов ошибок
import NotFoundError from '../errors/NotFoundError'; // импортируем класс ошибок NotFoundError
import BadRequestError from '../errors/BadRequestError';

// Импорт модели news и её интерфейса
import JuryMember from '../models/juryMember';

// Импорт статус-кодов ошибок
import {
  BAD_REQUEST_INCORRECT_PARAMS_ERROR_MESSAGE,
  CAST_INCORRECT_MEMBERID_ERROR_MESSAGE,
  CREATED_201,
  DELETE_MEMBER_MESSAGE,
  MEMBER_NOT_FOUND_ERROR_MESSAGE,
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

    const totalJuryMembersCount = await JuryMember.countDocuments();

    let juryMembersQuery = JuryMember.find(filters);

    if (sortBy) {
      juryMembersQuery = juryMembersQuery.sort({ [sortBy]: order });
    }

    if (page && limit) {
      juryMembersQuery = juryMembersQuery.skip(skip).limit(limit);
    }

    const members = await juryMembersQuery;

    res.send({
      data: members,
      totalPages: limit ? Math.ceil(totalJuryMembersCount / limit) : undefined,
      total: totalJuryMembersCount,
    });
  } catch (err) {
    next(err);
  }
};

const getJuryMemberById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memberId } = req.params;
    const juryMember = await JuryMember.findById(memberId);
    if (!juryMember) {
      throw new NotFoundError(MEMBER_NOT_FOUND_ERROR_MESSAGE);
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
    const juryMember = await JuryMember.create({
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
    const juryMember = await JuryMember.findByIdAndUpdate(
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
  const { surname, patronymic, name, about, link, imageUrl } = req.body;
  updateJuryMemberData(req, res, next, { surname, patronymic, name, about, link, imageUrl });
};

const updateJuryMemberImage = (req: Request, res: Response, next: NextFunction) => {
  const { imageUrl } = req.body;
  updateJuryMemberData(req, res, next, { imageUrl });
};

// Функция, которая удаляет новость по идентификатору
const deleteUnionMemberById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memberId } = req.params;
    const juryMember = await JuryMember.findById(memberId);
    if (!juryMember) {
      throw new NotFoundError(MEMBER_NOT_FOUND_ERROR_MESSAGE);
    }
    await JuryMember.findByIdAndDelete(memberId);
    res.send({ message: DELETE_MEMBER_MESSAGE });
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
