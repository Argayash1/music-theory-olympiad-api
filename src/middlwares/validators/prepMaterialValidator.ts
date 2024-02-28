import { celebrate, Joi } from 'celebrate';
import { urlRegEx } from '../../utils/constants';

const prepMaterialDataValidator = celebrate({
  // валидируем тело запроса
  body: Joi.object().keys({
    category: Joi.string().required().max(2),
    dictations: Joi.object()
      .keys({
        scoreUrl: Joi.string().required().min(2),
        data: Joi.array().items(
          Joi.object().keys({
            audioUrl: Joi.string().required(),
            title: Joi.string().required().min(2).max(60),
            author: Joi.string().required().min(2).max(30),
          }),
        ),
      })
      .required(),
    soundAnalysis: Joi.object()
      .keys({
        audioUrl: Joi.string().required(),
        title: Joi.string().required().min(2).max(60),
        author: Joi.string().required().min(2).max(30),
        tableUrl: Joi.string().required(),
        imageUrl: Joi.string().required(),
      })
      .required(),
    harmonization: Joi.object()
      .keys({
        scoreUrl: Joi.string().required(),
        imageUrl: Joi.string().required(),
      })
      .required(),
    solfeggio: Joi.object()
      .keys({
        scoreUrl: Joi.string().required(),
        imageUrl: Joi.string().required(),
      })
      .required(),
  }),
});

const prepMaterialQueryParamsValidator = celebrate({
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(100),
  }),
});

const prepMaterialIdValidator = celebrate({
  // валидируем параметры
  params: Joi.object().keys({
    prepMaterialId: Joi.string().hex().length(24).required(),
  }),
});

export { prepMaterialDataValidator, prepMaterialQueryParamsValidator, prepMaterialIdValidator };
