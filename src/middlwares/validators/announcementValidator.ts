import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const announcementDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(60),
    content: Joi.string().required().min(2),
  }),
});

const announcementQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
  }),
});

const announcementIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    announcementId: Joi.string().hex().length(24).required(),
  }),
});

export { announcementDataValidator, announcementQueryParamsValidator, announcementIdValidator };
