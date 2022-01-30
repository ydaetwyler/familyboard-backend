import { AuthenticationError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const createEventItem = async (args, context, EventItem, User, Family) => {
    try {
        const contextReturn = await context

        if (!contextReturn.isAuth) {
            throw new AuthenticationError('Login necessary')
        }

        const { 
            activityName,
            activityImageUrl,
            activityDate,
            activityDescription,
            activityLocation,
            activityAddress,
            activityUrl
        } = args

        const user = await User.findById({ _id: contextReturn.userId })

        const familyId = await user.family

        const familyFetched = await Family.findById({ _id: familyId })
        const familyMembers = familyFetched.familyMembers

        await familyMembers.pull(contextReturn.userId)

        const eventItem = await new EventItem({
            activityName,
            activityImageUrl,
            activityDate,
            activityOwner: user.id,
            activityDescription,
            activityLocation,
            activityAddress,
            activityUrl,
            activityUpdateUsers: familyMembers
        })

        const newEventItem = await eventItem.save()

        await Family.findByIdAndUpdate({ _id: familyId }, {
            $push: {
                eventList: [newEventItem.id]
            }
        })
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error creating Event',
            errorObject: e
        })
        throw e
    }
}

export default createEventItem