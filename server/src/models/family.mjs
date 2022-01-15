import mongoose from 'mongoose'

const Schema = mongoose.Schema

const familySchema = new Schema(
    {
        familyName: {
            type: String,
            required: false,
        },
        familyAvatarUrl: {
            type: String,
            required: false,
        },
        familyMembers: {
            type: [Schema.Types.ObjectId],
            ref: 'user',
            required: false,
        },
        eventList: {
            type: [Schema.Types.ObjectId],
            ref: 'eventItem',
            required: false,
        },
        collectionList: {
            type: [Schema.Types.ObjectId],
            ref: 'CollectionList',
            required: false,
        },
    },
    { timestamps: true }
)

export default mongoose.model('family', familySchema, 'family')