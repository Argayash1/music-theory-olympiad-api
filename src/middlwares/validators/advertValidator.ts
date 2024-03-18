import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const advertDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(60),
    content: Joi.string().required().min(2),
    linkText: Joi.string().min(2),
    linkUrl: Joi.string(),
  }),
});

const advertQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
  }),
});

const advertIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    advertId: Joi.string().hex().length(24).required(),
  }),
});

export { advertDataValidator, advertQueryParamsValidator, advertIdValidator };
