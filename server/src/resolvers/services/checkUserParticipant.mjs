import { AuthenticationError } from 'apollo-server-express'

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
        console.log(`Error checking user is participant, -> ${e}`)
        throw e
    }
}

export default checkUserParticipant