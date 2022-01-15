import { AuthenticationError } from 'apollo-server-express'

const getEventItem = async (args, context, EventItem) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const { _id } = args

        const eventItemFetched = await EventItem.findById({ _id: _id })
            .populate('activityParticipantsList')
            .populate('comments')
            .populate('activityUpdateUsers')
            .populate('activityNewCommentUsers')

        eventItemFetched.activityParticipantsList.some(user => user.id === context.userId)
        ? eventItemFetched.userJoined = true
        : eventItemFetched.userJoined = false

        eventItemFetched.activityUpdateUsers.some(user => user.id === context.userId)
        ? eventItemFetched.updated = true
        : eventItemFetched.updated = false

        eventItemFetched.activityNewCommentUsers.some(user => user.id === context.userId)
        ? eventItemFetched.newComment = true
        : eventItemFetched.newComment = false

        return eventItemFetched
    } catch (e) {
        console.log(`Error fetching event item, -> ${e}`)
        throw e
    }
}

export default getEventItem