import { Schema, model, Document } from 'mongoose';

import isUrl from 'validator/lib/isURL';

interface IAudio {
  audioUrl: string;
  title: string;
  author: string;
}

interface IDictation extends IAudio {
  scoreUrl: string;
}

interface ISoundAnalysis extends IAudio {
  tableUrl: string;
}

interface IPrepMaterial extends Document {
  category: string;
  dictations: IDictation[];
  soundAnalysis: ISoundAnalysis;
  harmScoreUrl: string;
  solfScoreUrl: string;
}

const prepMaterialSchema = new Schema<IPrepMaterial>(
  {
    category: {
      type: String,
      required: [true, 'не указана категория материала'],
      maxlength: [2, 'длина категории материала должна быть не более 2 символов'],
    },
    dictations: {
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
          scoreUrl: {
            type: String,
            required: [true, 'не указана ссылка на ноты диктанта'],
            validate: {
              validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
              message: 'некорректный формат ссылки на ноты диктанта',
            },
          },
        },
      ],
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
        tableUrl: {
          type: String,
          required: [true, 'не указана ссылка на таблицу для слухового анализа'],
          validate: {
            validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
            message: 'некорректный формат ссылки на таблицу для слухового анализа',
          },
        },
      },
    },
    harmScoreUrl: {
      type: String,
      required: [true, 'не указана ссылка на ноты для гармонизации'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на на ноты для гармонизации',
      },
    },
    solfScoreUrl: {
      type: String,
      required: [true, 'не указана ссылка на ноты для сольфеджирования'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на ноты для сольфеджирования',
      },
    },
  },
  { versionKey: false },
);

export default model<IPrepMaterial>('prepMaterial', prepMaterialSchema);
