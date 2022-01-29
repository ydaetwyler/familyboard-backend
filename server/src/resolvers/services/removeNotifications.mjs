import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const removeNotifications = async (args, context, Family, EventItem) => {    
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }

    try {
        const { eventId } = args

        const userFamily = await Family.findById({ _id: context.familyId })
            .populate('eventList')

        if (!userFamily.eventList) throw new ForbiddenError('Forbidden')

        if (!userFamily.eventList.some(event => event.id === eventId)) throw new ForbiddenError('Forbidden')

        await EventItem.findByIdAndUpdate({ _id: eventId }, {
            $pullAll: {
                activityUpdateUsers: [context.userId],
                activityNewCommentUsers: [context.userId]
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