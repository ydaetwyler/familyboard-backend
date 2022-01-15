import mongoose from 'mongoose'

const Schema = mongoose.Schema

const taskItemSchema = new Schema(
    {
        taskName: {
            type: String,
            required: true,
        },
        taskPriority: {
            type: String,
            required: true,
        },
        taskDescription: {
            type: String,
            required: false,
        },
        taskDue: {
            type: Date,
            required: false,
        },
        taskOwner: {
            type: String,
            required: true,
        },
        taskResponsibles: {
            type: [String],
            required: false,
        },
        taskKanbanList: {
            type: [String],
            required: true,
        },
        taskKanban: {
            type: String,
            required: true,
        },
        taskImageUrl: {
            type: String,
            required: false,
        },
        taskUrl: {
            type: String,
            required: false,
        },
        taskImageList: {
            type: Schema.Types.ObjectId,
            ref: 'taskImageList',
            required: true,
        },
        comments: {
            type: [Schema.Types.ObjectId],
            red: 'comment',
            required: false,
        }
    },
    { timestamps: true }
)

export default mongoose.model('taskItem', taskItemSchema, 'taskItem')