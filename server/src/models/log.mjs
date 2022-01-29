import mongoose from 'mongoose'

const Schema = mongoose.Schema

const logSchema = new Schema(
    {
        time: {
            type: Date,
            required: false,
        },
        file: {
            type: String,
            required: false,
        },
        message: {
            type: String,
            required: false,
        },
        errorObject: {
            type: Object,
            required: false,
        },
    },
    { timestamps: true }
)

export default mongoose.model('log', logSchema, 'log')