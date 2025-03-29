import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const juryMemberDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
    surname: Joi.string().required().min(2).max(30),
    patronymic: Joi.string().required().min(2).max(30),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
    link: Joi.string().required(),
  }),
});

const juryMemberQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
    sortBy: Joi.string().valid('_id', 'surname', 'name', 'patronymic', 'imageUrl', 'link', 'about'),
    order: Joi.string().valid('asc', 'desc'),
    category: Joi.string().max(2),
    name: Joi.string().min(1).max(30),
    surname: Joi.string().min(1).max(30)
  }),
});

const juryMemberInfoDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
    surname: Joi.string().required().min(2).max(30),
    patronymic: Joi.string().required().min(2).max(30),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2),
    link: Joi.string().required(),
  }),
});

const juryMemberImageUrlValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    imageUrl: Joi.string().required(),
  }),
});

const juryMemberIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    memberId: Joi.string().hex().length(24).required(),
  }),
});

export {
  juryMemberDataValidator,
  juryMemberQueryParamsValidator,
  juryMemberInfoDataValidator,
  juryMemberImageUrlValidator,
  juryMemberIdValidator,
};
