import { Schema, model, Document } from 'mongoose';

import isUrl from 'validator/lib/isURL';

interface IArchiveElement {
  link: string;
  category: string;
}

interface IArchive extends Document {
  year: string;
  dictations: IArchiveElement[];
  soundAnalysis: IArchiveElement[];
  harmonisation: IArchiveElement[];
  solfeggio: IArchiveElement[];
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
    },
    soundAnalysis: {
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
    },
    harmonisation: {
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
    },
  },
  { versionKey: false },
);

export default model<IArchive>('archive', archiveSchema);
