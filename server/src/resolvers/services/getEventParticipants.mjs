import { AuthenticationError } from 'apollo-server-express'

const getEventParticipants = async (args, context, EventItem) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const { _id } = args

        const eventItemFetched = await EventItem.findById({ _id: _id })
            .populate('activityParticipantsList')

        return eventItemFetched
    } catch (e) {
        console.log(`Error fetching event item, -> ${e}`)
        throw e
    }
}

export default getEventParticipants