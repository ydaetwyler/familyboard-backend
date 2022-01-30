import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const getEventComments = async (args, context, Family, EventItem) => {
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
            .populate({path: 'comments', select: 'createdAt', options: { sort: { createdAt: -1 } }})

        return eventItemFetched
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error fetching event comments',
            errorObject: e
        })
        throw e
    }
}

export default getEventComments