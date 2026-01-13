import { model, Schema } from "mongoose";
import { saveErrorHandler, setUpdateSettings } from './hooks.js';


const sessionsSchema = new Schema(
  {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'users',
          required: true
        },
        accessToken: {
            type: String,
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        accessTokenValidUntil: {
            type: Date,
            required: true
        },
        refreshTokenValidUntil: {
            type: Date,
            required: true
        },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
sessionsSchema.post('save', saveErrorHandler);
sessionsSchema.pre('findOneAndUpdate', setUpdateSettings);
sessionsSchema.post('findOneAndUpdate', saveErrorHandler);

const SessionsCollection = model('sessions', sessionsSchema);
export default SessionsCollection;
