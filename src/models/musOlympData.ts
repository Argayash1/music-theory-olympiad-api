import { Schema, model, Document } from 'mongoose';

interface IMusOlympData extends Document {
  olympNumber: number;
  dates: string;
  registrationDates: string;
  city: string;
  topic: string;
  participants: string;
}

const musOlympDataSchema = new Schema<IMusOlympData>(
  {
    olympNumber: {
      type: Number,
      required: [true, 'не передан номер олимпиады'],
      maxlength: [2, 'длина номера олимпиады должна быть не более 2 символов'],
    },
    dates: {
      type: String,
      required: [true, 'не переданы даты проведения олимпиады'],
      minlength: [2, 'длина дат проведения олимпиады должна быть не менее 2 символов'],
      maxlength: [30, 'длина дат проведения олимпиады должна быть не более 30 символов'],
    },
    registrationDates: {
      type: String,
      required: [true, 'не переданы даты приёма заявок на участие в олимпиаде'],
      minlength: [2, 'длина дат пприёма заявок на участие в олимпиаде должна быть не менее 2 символов'],
      maxlength: [60, 'длина дат приёма заявок на участие в олимпиаде должна быть не более 60 символов'],
    },
    city: {
      type: String,
      required: [true, 'не передан город проведения олимпиады'],
      minlength: [2, 'длина города проведения олимпиады должна быть не менее 2 символов'],
      maxlength: [30, 'длина города проведения олимпиады должна быть не более 30 символов'],
    },
    topic: {
      type: String,
      required: [true, 'не передана тематика олимпиады'],
      minlength: [2, 'длина тематики олимпиады должна быть не менее 2 символов'],
      maxlength: [100, 'длина тематики олимпиады должна быть не более 100 символов'],
    },
    participants: {
      type: String,
      required: [true, 'не переданы участники олимпиады'],
      minlength: [2, 'длина участников олимпиады должна быть не менее 2 символов'],
    },
  },
  { versionKey: false },
);

export default model<IMusOlympData>('musOlympData', musOlympDataSchema);
