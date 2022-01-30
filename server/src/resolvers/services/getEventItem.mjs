import { AuthenticationError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const getEventItem = async (args, context, Family, EventItem) => {
    try {
        const contextReturn = await context

        if (!contextReturn.isAuth) {
            throw new AuthenticationError('Login necessary')
        }

        const { _id } = args

        const userFamily = await Family.findById({ _id: contextReturn.familyId })
            .populate('eventList')

        if (!userFamily.eventList) throw new ForbiddenError('Forbidden')

        if (!userFamily.eventList.some(event => event.id === _id)) throw new ForbiddenError('Forbidden')

        const eventItemFetched = await EventItem.findById({ _id: _id })
            .populate('activityParticipantsList')
            .populate('comments')
            .populate('activityUpdateUsers')
            .populate('activityNewCommentUsers')

        eventItemFetched.activityParticipantsList.some(user => user.id === contextReturn.userId)
        ? eventItemFetched.userJoined = true
        : eventItemFetched.userJoined = false

        eventItemFetched.activityUpdateUsers.some(user => user.id === contextReturn.userId)
        ? eventItemFetched.updated = true
        : eventItemFetched.updated = false

        eventItemFetched.activityNewCommentUsers.some(user => user.id === contextReturn.userId)
        ? eventItemFetched.newComment = true
        : eventItemFetched.newComment = false

        return eventItemFetched
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error fetching event item',
            errorObject: e
        })
        throw e
    }
}

export default getEventItem