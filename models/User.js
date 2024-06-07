import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';
import { emailRegexp, subscriptionList } from '../constants/user-constants.js';

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        match: emailRegexp,
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
    },
    subscription: {
        type: String,
        enum: subscriptionList,
        default: "starter"
    },
    avatarURL: {
        type: String,
    },
    token: {
        type: String,
        default: null,
    }
}, { versionKey: false, timestamps: true  });

userSchema.pre('findOneAndUpdate', setUpdateSettings);
userSchema.post('save', handleSaveError);
userSchema.post('findOneAndUpdate', handleSaveError);

const User = model('user', userSchema);

export default User;