import { Schema, model, Document } from 'mongoose';

import isUrl from 'validator/lib/isURL';

interface IResult extends Document {
  category: string;
  url: string;
}

const resultSchema = new Schema<IResult>(
  {
    category: {
      type: String,
      required: [true, 'не указана категория результата'],
      maxlength: [2, 'длина категории результата должна быть не более 2 символов'],
    },
    url: {
      type: String,
      required: [true, 'не передана ссылка на файл с результатами'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на файл с результатами',
      },
    },
  },
  { versionKey: false },
);

export default model<IResult>('result', resultSchema);
