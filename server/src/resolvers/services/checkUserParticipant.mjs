import { AuthenticationError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const checkUserParticipant = async (args, context, EventItem) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const { _id } = args

        let isParticipant = false

        const eventItemFetched = await EventItem.findById({ _id: _id })
            .populate('activityParticipantsList')

        if (eventItemFetched.activityParticipantsList) {
            isParticipant = eventItemFetched.activityParticipantsList.some(user => user.id === context.userId)
        }

        return isParticipant
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error checking user is participant',
            errorObject: e
        })
        throw e
    }
}

export default checkUserParticipant