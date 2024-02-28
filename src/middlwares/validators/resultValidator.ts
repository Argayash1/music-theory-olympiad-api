import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const resultDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    category: Joi.string().required().max(2),
    url: Joi.string().required(),
  }),
});

const resultIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    resultId: Joi.string().hex().length(24).required(),
  }),
});

const resultIndexValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    resultIndex: Joi.string().max(2).required(),
  }),
});

export { resultDataValidator, resultIdValidator, resultIndexValidator };
