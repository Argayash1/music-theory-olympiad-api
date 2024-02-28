import { Schema, model, Document } from 'mongoose';

import isUrl from 'validator/lib/isURL';

interface IArchiveObject {
  link: string;
  category: string;
}

interface IArchive extends Document {
  year: string;
  dictations: IArchiveObject[];
  soundAnalysis: IArchiveObject[];
  harmonization: IArchiveObject[];
  solfeggio: IArchiveObject[];
}

const archiveSchema = new Schema<IArchive>(
  {
    year: {
      type: String,
      required: [true, 'не указан год'],
    },
    dictations: {
      type: [
        {
          category: {
            type: String,
            required: [true, 'не указана категория для диктантов'],
            maxlength: [2, 'длина категории для диктантов должна быть не более 2 символов'],
          },
          link: {
            type: String,
            required: [true, 'не указана ссылка на архив с диктантами'],
            validate: {
              validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
              message: 'некорректный формат ссылки на архив с диктантами',
            },
          },
        },
      ],
      validate: {
        validator: (arr: IArchiveObject[]) => arr && arr.length > 0,
        message: 'не передан массив диктантов или он не содержит ни одного элемента',
      },
    },
    soundAnalysis: {
      type: [
        {
          category: {
            type: String,
            required: [true, 'не указана категория для слухового анализа'],
            maxlength: [2, 'длина категории для слухового анализа должна быть не более 2 символов'],
          },
          link: {
            type: String,
            required: [true, 'не указана ссылка на архив для слухового анализа'],
            validate: {
              validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
              message: 'некорректный формат ссылки на архив для слухового анализа',
            },
          },
        },
      ],
      validate: {
        validator: (arr: IArchiveObject[]) => arr && arr.length > 0,
        message: 'не передан массив данных для слухового анализа или он не содержит ни одного элемента',
      },
    },
    harmonization: {
      type: [
        {
          category: {
            type: String,
            required: [true, 'не указана категория для гармонизации'],
            maxlength: [2, 'длина категории для гармонизации должна быть не более 2 символов'],
          },
          link: {
            type: String,
            required: [true, 'не указана ссылка на архив для гармонизации'],
            validate: {
              validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
              message: 'некорректный формат ссылки на архив для гармонизации',
            },
          },
        },
      ],
      validate: {
        validator: (arr: IArchiveObject[]) => arr && arr.length > 0,
        message: 'не передан массив данных для гармонизации или он не содержит ни одного элемента',
      },
    },
    solfeggio: {
      type: [
        {
          category: {
            type: String,
            required: [true, 'не указана категория для сольфеджирования'],
            maxlength: [2, 'длина категории для сольфеджирования должна быть не более 2 символов'],
          },
          link: {
            type: String,
            required: [true, 'не указана ссылка на архив для сольфеджирования'],
            validate: {
              validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
              message: 'некорректный формат ссылки на архив для сольфеджирования',
            },
          },
        },
      ],
      validate: {
        validator: (arr: IArchiveObject[]) => arr && arr.length > 0,
        message: 'не передан массив данных для сольфеджирования или он не содержит ни одного элемента',
      },
    },
  },
  { versionKey: false },
);

export default model<IArchive>('archive', archiveSchema);
