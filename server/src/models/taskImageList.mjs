import mongoose from 'mongoose'

const Schema = mongoose.Schema

const taskImageListSchema = new Schema(
    {
        taskImageUrl: {
            type: [String],
            required: false,
        }
    },
    { timestamps: true }
)

export default mongoose.model('taskImageList', taskImageListSchema, 'taskImageList')