import { AuthenticationError } from 'apollo-server-express'

const getEventItem = async (args, context, Family, EventItem) => {
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