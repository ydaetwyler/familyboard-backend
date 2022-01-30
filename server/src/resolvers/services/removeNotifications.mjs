import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const removeNotifications = async (args, context, Family, EventItem) => {    
    try {
        const contextReturn = await context

        if (!contextReturn.isAuth) {
            throw new AuthenticationError('Login necessary')
        }

        const { eventId } = args

        const userFamily = await Family.findById({ _id: contextReturn.familyId })
            .populate('eventList')

        if (!userFamily.eventList) throw new ForbiddenError('Forbidden')

        if (!userFamily.eventList.some(event => event.id === eventId)) throw new ForbiddenError('Forbidden')

        await EventItem.findByIdAndUpdate({ _id: eventId }, {
            $pullAll: {
                activityUpdateUsers: [contextReturn.userId],
                activityNewCommentUsers: [contextReturn.userId]
            }
        })
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error removing notifications on event',
            errorObject: e
        })
        throw e
    }
}

export default removeNotifications