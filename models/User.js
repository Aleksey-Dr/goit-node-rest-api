import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';
import { emailRegexp, subscriptionList } from '../constants/user-constants.js';

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'User must have username'],
    },
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
    subscription: {
        type: String,
        enum: subscriptionList,
        default: "starter"
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