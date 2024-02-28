import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const archiveDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    year: Joi.string().required().max(2),
    dictations: Joi.array()
      .items(
        Joi.object().keys({
          category: Joi.string().required().max(2),
          link: Joi.string().required(),
        }),
      )
      .required(),
    soundAnalysis: Joi.array()
      .items(
        Joi.object().keys({
          category: Joi.string().required().max(2),
          link: Joi.string().required(),
        }),
      )
      .required(),
    harmonization: Joi.array()
      .items(
        Joi.object().keys({
          category: Joi.string().required().max(2),
          link: Joi.string().required(),
        }),
      )
      .required(),
    solfeggio: Joi.array()
      .items(
        Joi.object().keys({
          category: Joi.string().required().max(2),
          link: Joi.string().required(),
        }),
      )
      .required(),
  }),
});

const archiveQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
  }),
});

const archiveIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    archiveId: Joi.string().hex().length(24).required(),
  }),
});

export { archiveDataValidator, archiveQueryParamsValidator, archiveIdValidator };
