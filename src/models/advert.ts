import { Schema, model, Document } from 'mongoose';

import isUrl from 'validator/lib/isURL';

interface IAdvert extends Document {
  createdAt?: Date;
  title: string;
  content: string;
  linkText?: string;
  linkUrl?: string;
}

const advertSchema = new Schema<IAdvert>(
  {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    title: {
      type: String,
      required: [true, 'не передан заголовок объявления'],
      minlength: [2, 'длина заголовка объявления должна быть не менее 2 символов'],
      maxlength: [60, 'длина заголовка объявления должна быть не более 60 символов'],
    },
    content: {
      type: String,
      required: [true, 'не передан текст объявления'],
      minlength: [2, 'длина текста объявления должна быть не менее 2 символов'],
    },
    linkText: {
      type: String,
      required: [true, 'не передан текст ссылки'],
      minlength: [2, 'длина текста ссылки должна быть не менее 2 символов'],
    },
    linkUrl: {
      type: String,
      required: [true, 'не передан URL ссылки'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки',
      },
    },
  },
  { versionKey: false },
);

export default model<IAdvert>('advert', advertSchema);
