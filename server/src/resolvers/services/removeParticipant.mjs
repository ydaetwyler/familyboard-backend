import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const removeParticipant = async (args, context, Family, EventItem) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }

    try {
        const { _id } = args

        const userFamily = await Family.findById({ _id: context.familyId })
            .populate('eventList')

        if (!userFamily.eventList) throw new ForbiddenError('Forbidden')

        if (!userFamily.eventList.some(event => event.id === _id)) throw new ForbiddenError('Forbidden')

        await EventItem.findByIdAndUpdate({ _id: _id }, {
            $pullAll: {
                activityParticipantsList: [context.userId]
            }
        })
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error updating user name',
            errorObject: e
        })
        throw e
    }
}

export default removeParticipant