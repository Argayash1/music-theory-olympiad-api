import { Schema, model, Document } from 'mongoose';

import isUrl from 'validator/lib/isURL';

interface IJuryMember extends Document {
  imageUrl: string;
  surname: string;
  patronymic: string;
  name: string;
  about: string;
  link: string;
}

const juryMemberSchema = new Schema<IJuryMember>(
  {
    imageUrl: {
      type: String,
      required: [true, 'не передана ссылка на фотографию члена жюри'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на фотографию члена жюри',
      },
    },
    surname: {
      type: String,
      required: [true, 'не передана фамилия члена жюри'],
      minlength: [2, 'длина фамилии члена жюри должна быть не менее 2 символов'],
      maxlength: [30, 'длина фамилии члена жюри должна быть не более 30 символов'],
    },
    patronymic: {
      type: String,
      required: [true, 'не передано отчество члена жюри'],
      minlength: [2, 'длина отчества члена жюри должна быть не менее 2 символов'],
      maxlength: [30, 'длина отчества члена жюри должна быть не более 30 символов'],
    },
    name: {
      type: String,
      required: [true, 'не передано имя члена жюри'],
      minlength: [2, 'длина имени члена жюри должна быть не менее 2 символов'],
      maxlength: [30, 'длина имени члена жюри должна быть не более 30 символов'],
    },
    about: {
      type: String,
      required: [true, 'не передана информация о члене жюри'],
      minlength: [2, 'длина информация о члене жюри должна быть не менее 2 символов'],
    },
    link: {
      type: String,
      required: [true, 'не передана ссылка на веб-страницу члена жюри'],
      validate: {
        validator: (url: string) => isUrl(url, { protocols: ['http', 'https'], require_protocol: true }),
        message: 'некорректный формат ссылки на веб-страницу члена жюри',
      },
    },
  },
  { versionKey: false },
);

export default model<IJuryMember>('juryMember', juryMemberSchema);
