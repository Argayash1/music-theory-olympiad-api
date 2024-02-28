import { Schema, model, Document } from 'mongoose';

import isUrl from 'validator/lib/isURL';

interface IDictation {
  audioUrl: string;
  title: string;
  author: string;
}

interface ISoundAnalysis extends IDictation {
  tableUrl: string;
  imageUrl: string;
}

interface IDictations {
  scoreUrl: string;
  data: IDictation[];
}

interface IHarmonyAndSolf {
  scoreUrl: string;
  imageUrl: string;
}

interface IPrepMaterial extends Document {
  category: string;
  dictations: IDictations;
  soundAnalysis: ISoundAnalysis;
  harmonization: IHarmonyAndSolf;
  solfeggio: IHarmonyAndSolf;
}

const prepMaterialSchema = new Schema<IPrepMaterial>(
  {
    category: {
      type: String,
      required: [true, 'не указана категория материала'],
      maxlength: [2, 'длина категории материала должна быть не более 2 символов'],
    },
    dictations: {
      type: {
        scoreUrl: {
          type: String,
          required: [true, 'не указана ссылка на аудиозапись для слухового анализа'],
          validate: {
            validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
            message: 'некорректный формат ссылки на аудиозапись для слухового анализа',
          },
        },
        data: {
          type: [
            {
              audioUrl: {
                type: String,
                required: [true, 'не указана ссылка на аудиозапись диктанта'],
                validate: {
                  validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
                  message: 'некорректный формат ссылки на аудиозапись диктанта',
                },
              },
              title: {
                type: String,
                required: [true, 'не указано название диктанта'],
                minlength: [2, 'длина названия диктанта должна быть не менее 2 символов'],
                maxlength: [60, 'длина названия диктанта должна быть не более 60 символов'],
              },
              author: {
                type: String,
                required: [true, 'не указан автор диктанта'],
                minlength: [2, 'длина ФИО автора диктанта должна быть не менее 2 символов'],
                maxlength: [30, 'длина ФИО автора диктанта должна быть не более 30 символов'],
              },
            },
          ],
        },
      },
      required: [true, 'не передан объект с диктантами'],
    },
    soundAnalysis: {
      type: {
        audioUrl: {
          type: String,
          required: [true, 'не указана ссылка на аудиозапись для слухового анализа'],
          validate: {
            validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
            message: 'некорректный формат ссылки на аудиозапись для слухового анализа',
          },
        },
        title: {
          type: String,
          required: [true, 'не указано название произведения для слухового анализа'],
          minlength: [2, 'длина названия произведения для слухового анализа должна быть не менее 2 символов'],
          maxlength: [60, 'длина названия произведения для слухового анализа должна быть не более 60 символов'],
        },
        author: {
          type: String,
          required: [true, 'не указан автор произведения для слухового анализа'],
          minlength: [2, 'длина ФИО автора произведения для слухового анализа должна быть не менее 2 символов'],
          maxlength: [30, 'длина ФИО автора произведения для слухового анализа должна быть не более 30 символов'],
        },
        imageUrl: {
          type: String,
          required: [true, 'не указана ссылка на таблицу для слухового анализа'],
          validate: {
            validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
            message: 'некорректный формат ссылки на таблицу для слухового анализа',
          },
        },
        tableUrl: {
          type: String,
          required: [true, 'не указана ссылка на таблицу для слухового анализа'],
          validate: {
            validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
            message: 'некорректный формат ссылки на таблицу для слухового анализа',
          },
        },
      },
      required: [true, 'не передан объект с данными для слухового анализа'],
    },
    harmonization: {
      type: {
        scoreUrl: {
          type: String,
          required: [true, 'не указана ссылка на ноты для гармонизации'],
          validate: {
            validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
            message: 'некорректный формат ссылки на ноты для гармонизации',
          },
        },
        imageUrl: {
          type: String,
          required: [true, 'не указана ссылка на изображение нот для гармонизации'],
          validate: {
            validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
            message: 'некорректный формат ссылки на изображение нот для гармонизации',
          },
        },
      },
      required: [true, 'не передан объект с данными для гармонизации'],
    },
    solfeggio: {
      type: {
        scoreUrl: {
          type: String,
          required: [true, 'не указана ссылка на ноты для сольфеджирования'],
          validate: {
            validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
            message: 'некорректный формат ссылки на ноты для сольфеджирования',
          },
        },
        imageUrl: {
          type: String,
          required: [true, 'не указана ссылка на изображение нот для сольфеджирования'],
          validate: {
            validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
            message: 'некорректный формат ссылки на изображение нот для сольфеджирования',
          },
        },
      },
      required: [true, 'не передан объект с данными для сольфеджирования'],
    },
  },
  { versionKey: false },
);

export default model<IPrepMaterial>('prepMaterial', prepMaterialSchema);
