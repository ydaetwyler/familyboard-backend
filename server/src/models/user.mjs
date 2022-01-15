import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema(
    {
        userEmail: {
            type: String,
            required: false,
            unique: true,
        },
        userName: {
            type: String,
            required: false,
        },
        password: {
            type: String,
            required: false,
        },
        hash: {
            type: String,
            required: false,
        },
        avatarUrl: {
            type: String,
            required: false,
        },
        selectedBgValue: {
            type: String,
            required: false,
        },
        selectedBgLabel: {
            type: String,
            required: false,
        },
        active: {
            type: Boolean,
            required: false,
        },
        family: {
            type: Schema.Types.ObjectId,
            ref: 'family',
            required: false,
        }
    },
    { timestamps: true }
)

export default mongoose.model('user', userSchema, 'user')