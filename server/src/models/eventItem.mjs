import mongoose from 'mongoose'

const Schema = mongoose.Schema

const eventItemSchema = new Schema(
    {
        activityName: {
            type: String,
            required: true,
        },
        activityImageUrl: {
            type: String,
            required: false,
        },
        activityDate: {
            type: Date,
            required: false,
        },
        activityDescription: {
            type: String,
            required: false,
        },
        activityLocation: {
            type: String,
            required: false,
        },
        activityCoordinates: {
            type: String,
            required: false,
        },
        activityApiCityNotFound: {
            type: Boolean,
            required: false,
        },
        activityApiLastCall: {
            type: Date,
            required: false,
        },
        activityWeatherIcon: {
            type: String,
            required: false,
        },
        activityWeatherTemp: {
            type: String,
            required: false,
        },
        activityWeatherDesc: {
            type: String,
            required: false,
        },
        activityWeatherSunrise: {
            type: String,
            required: false,
        },
        activityWeatherSunset: {
            type: String,
            required: false,
        },
        activityWeatherWind: {
            type: String,
            required: false,
        },
        activityAddress: {
            type: String,
            required: false,
        },
        activityUrl: {
            type: String,
            required: false,
        },
        activityImageList: {
            type: String,
            required: false,
        },
        activityOwner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        activityParticipantsList: {
            type: [Schema.Types.ObjectId],
            ref: 'user',
            required: false
        },
        comments: {
            type: [Schema.Types.ObjectId],
            ref: 'comment',
            required: false,
        },
        activityUpdateUsers: {
            type: [Schema.Types.ObjectId],
            ref: 'user',
            required: false,
        },
        activityNewCommentUsers: {
            type: [Schema.Types.ObjectId],
            ref: 'user',
            required: false,
        },
    },
    { timestamps: true }
)

export default mongoose.model('eventItem', eventItemSchema, 'eventItem')