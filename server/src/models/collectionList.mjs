import mongoose from 'mongoose'

const Schema = mongoose.Schema

const collectionListSchema = new Schema(
    {
        collectionName: {
            type: String,
            required: true
        },
        collectionIconUrl: {
            type: String,
            required: false,
        },
        tasks: {
            type: [Schema.Types.ObjectId],
            ref: 'taskItem',
            required: false,
        }
    },
    { timestamps: true }
)

export default mongoose.model('collectionList', collectionListSchema, 'collectionList')