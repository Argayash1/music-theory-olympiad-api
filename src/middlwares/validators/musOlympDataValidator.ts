import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const musOlympDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    olympNumber: Joi.number().required(),
    dates: Joi.string().required().min(2).max(30),
    registrationDates: Joi.string().required().min(2).max(60),
    city: Joi.string().required().min(2).max(30),
    topic: Joi.string().required().min(2).max(100),
    participants: Joi.string().required().min(2),
  }),
});

const musOlympDataIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    musOlympId: Joi.string().hex().length(24).required(),
  }),
});

export { musOlympDataValidator, musOlympDataIdValidator };
