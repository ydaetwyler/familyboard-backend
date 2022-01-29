import { AuthenticationError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const getEventParticipants = async (args, context, Family, EventItem) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const { _id } = args

        const userFamily = await Family.findById({ _id: context.familyId })
            .populate('eventList')

        if (!userFamily.eventList) throw new ForbiddenError('Forbidden')

        if (!userFamily.eventList.some(event => event.id === _id)) throw new ForbiddenError('Forbidden')

        const eventItemFetched = await EventItem.findById({ _id: _id })
            .populate('activityParticipantsList')

        return eventItemFetched
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error getting event participants',
            errorObject: e
        })
        throw e
    }
}

export default getEventParticipants