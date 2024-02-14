import { Schema, model, Document } from 'mongoose';

interface IAnnouncement extends Document {
  createdAt?: Date;
  title: string;
  content: string;
}

const announcementSchema = new Schema<IAnnouncement>(
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
  },
  { versionKey: false },
);

export default model<IAnnouncement>('announcement', announcementSchema);
