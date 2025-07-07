import { Schema, model } from 'mongoose';
import { saveErrorHandler, setUpdateSettings } from './hooks.js';


const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: null,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      default: 'personal',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    }
    photo: {
      type: String
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
contactSchema.post("save", saveErrorHandler);
contactSchema.pre('findOneAndUpdate', setUpdateSettings);
contactSchema.post('findOneAndUpdate', saveErrorHandler);
export const contactSortFields = [
  "_id",
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
  'createdAt',
  'updatedAt',
];
const ContactCollection = model('contact', contactSchema);
export default ContactCollection;
