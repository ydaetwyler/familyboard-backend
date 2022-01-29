import { AuthenticationError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const getFamily = async (context, User, Family) => {
    if (!context[0].isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const user = await User.findById({ _id: context.userId })

        const familyId = user.family

        const familyFetched = await Family.findById({ _id: familyId })
            .populate('familyMembers')
            .populate('eventList')
            .populate({
                path: 'eventList', select: 'activityDate', options: { sort: { activityDate: +1 } },
                populate: 'activityParticipantsList'
            })

        return familyFetched
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error fetching family',
            errorObject: e
        })
        throw e
    }
}

export default getFamily