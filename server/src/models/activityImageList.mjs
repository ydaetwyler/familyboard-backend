import mongoose from 'mongoose'

const Schema = mongoose.Schema

const activityImageListSchema = new Schema(
    {
        activityImageUrl: {
            type: [String],
            required: false,
        }
    },
    { timestamps: true }
)

export default mongoose.model('activityImageList', activityImageListSchema, 'activityImageList')