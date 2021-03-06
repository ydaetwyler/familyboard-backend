import { PubSub, withFilter } from 'graphql-subscriptions'

const pubsub = new PubSub()

import family from '../models/family.mjs'
import user from '../models/user.mjs'
import eventItem from '../models/eventItem.mjs'
import comment from '../models/comment.mjs'

import signUp from './services/signup.mjs'
import signIn from './services/signin.mjs'
import createFamily from './services/createFamily.mjs'
import lostPassword from './services/lostPassword.mjs'
import resetPassword from './services/resetPassword.mjs'
import updateUser from './services/updateUser.mjs'
import selectBg from './services/selectBg.mjs'
import updateFamily from './services/updateFamily.mjs'
import invite from './services/invite.mjs'
import createEventItem from './services/createEventItem.mjs'
import updateEventItem from './services/updateEventItem.mjs'
import setCoordinates from './services/setCoordinates.mjs'
import setWeather from './services/setWeather.mjs'
import removeParticipant from './services/removeParticipant.mjs'
import addParticipant from './services/addParticipant.mjs'
import checkUserParticipant from './services/checkUserParticipant.mjs'
import createEventComment from './services/createEventComment.mjs'
import removeEventComment from './services/removeEventComment.mjs'
import removeNotifications from './services/removeNotifications.mjs'

import getFamily from './services/getFamily.mjs'
import getUser from './services/getUser.mjs'
import getEventItem from './services/getEventItem.mjs'
import getEventParticipants from './services/getEventParticipants.mjs'
import getWeather from './services/getWeather.mjs'
import getCoordinates from './services/getCoordinates.mjs'
import getEventComments from './services/getEventComments.mjs'
import getEventComment from './services/getEventComment.mjs'
import checkCommentOwner from './services/checkCommentOwner.mjs'

const resolvers = {
    Mutation: {
        createFamily: (_, args) => createFamily(args, family, user),
        signUp: (_, args, context) => signUp(args, context, user),
        signIn: (_, args, context) => signIn(args, context, user),
        lostPassword: (_, args) => lostPassword(args, user),
        resetPassword: (_, args, context) => resetPassword(args, context, user),
        updateFamily: (_, args, context) => {
            pubsub.publish('FAMILY_CHANGED', { familyChanged: args })
            updateFamily(args, context[0], user, family)
        },
        updateUser: (_, args, context) => updateUser(args, context[0], user),
        selectBg: (_, args, context) => selectBg(args, context[0], user),
        invite: (_, args, context) => invite(args, context[0], family, user),
        createEventItem: (_, args, context) => {
            pubsub.publish('EVENT_ITEM_CREATED', { eventItemCreated: args }),
            createEventItem(args, context[0], eventItem, user, family)
        }, 
        setCoordinates: (_, args, context) => {
            pubsub.publish('COORDINATES_CHANGED', { coordinatesChanged: args }),
            setCoordinates(args, context[0], family, eventItem)
        },
        setWeather: (_, args, context) => {
            pubsub.publish('WEATHER_CHANGED', { weatherChanged: args }),
            setWeather(args, context[0], family, eventItem)
        },
        removeParticipant: (_, args, context) => {
            pubsub.publish('PARTICIPANTS_CHANGED', { eventParticipantsChanged: args }),
            removeParticipant(args, context[0], family, eventItem)
        },
        addParticipant: (_, args, context) => {
            pubsub.publish('PARTICIPANTS_CHANGED', { eventParticipantsChanged: args }),
            addParticipant(args, context[0], family, eventItem)
        },
        checkUserParticipant: (_, args, context) => checkUserParticipant(args, context[0], eventItem),
        updateEventItem: (_, args, context) => {
            pubsub.publish('EVENT_ITEM_CHANGED', { eventItemChanged: args }),
            updateEventItem(args, context[0], eventItem, user, family)
        },
        removeEventItem: (_, args, context) => removeEventItem(args, context[0], eventItem, family),
        createEventComment: (_, args, context) => {
            pubsub.publish('EVENT_COMMENTS_CHANGED', { eventCommentsChanged: args }),
            createEventComment(args, context[0], comment, eventItem, user, family)
        },
        removeEventComment: (_, args, context) => {
            pubsub.publish('EVENT_COMMENTS_CHANGED', { eventCommentsChanged: args }),
            removeEventComment(args, context[0], family, comment, eventItem)
        },
        removeNotifications: (_, args, context) => {
            removeNotifications(args, context[0], family, eventItem)
        },
    },
    Query: {
        getFamily: (_, __, context) => getFamily(context[0], user, family),
        getUser: (_, __, context) => getUser(context[0], user),
        getEventItem: (_, args, context) => getEventItem(args, context[0], family, eventItem),
        getEventParticipants: (_, args, context) => getEventParticipants(args, context[0], family, eventItem),
        getWeather: (_, args, context) => getWeather(args, context[0], family, eventItem),
        getCoordinates: (_, args, context) => getCoordinates(args, context[0], family, eventItem),
        getEventComments: (_, args, context) => getEventComments(args, context[0], family, eventItem),
        getEventComment: (_, args, context) => getEventComment(args, context[0], comment),
        checkCommentOwner: (_, args, context) => checkCommentOwner(args, context[0], comment),
    },
    Subscription: {
        familyChanged: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('FAMILY_CHANGED'),
                (payload, variables) => {
                    return (payload.familyChanged._id === variables._id)
                }
            )
        },
        eventItemCreated: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('EVENT_ITEM_CREATED'),
                (payload, variables) => {
                    return (payload.eventItemCreated.familyID === variables._id)
                }
            )
        },
        eventItemChanged: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('EVENT_ITEM_CHANGED'),
                (payload, variables) => {
                    return (payload.eventItemChanged._id === variables._id)
                }
            )
        },
        eventParticipantsChanged: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('PARTICIPANTS_CHANGED'),
                (payload, variables) => {
                    return (payload.eventParticipantsChanged._id === variables._id)
                }
            )
        },
        weatherChanged: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('WEATHER_CHANGED'),
                (payload, variables) => {
                    return (payload.weatherChanged._id === variables._id)
                }
            )
        },
        coordinatesChanged: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('COORDINATES_CHANGED'),
                (payload, variables) => {
                    return (payload.coordinatesChanged._id === variables._id)
                }
            )
        },
        eventCommentsChanged: {
            subscribe: withFilter(
                () => pubsub.asyncIterator('EVENT_COMMENTS_CHANGED'),
                (payload, variables) => {
                    return (payload.eventCommentsChanged._id === variables._id)
                }
            )
        },
    }
}

export default resolvers