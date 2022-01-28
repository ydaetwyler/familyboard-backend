import { AuthenticationError } from 'apollo-server-express'

const removeNotifications = async (args, context, Family, EventItem) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const { eventId } = args

        const userFamily = await Family.findById({ _id: context.familyId })
            .populate('eventList')

        if (!userFamily.eventList) throw new ForbiddenError('Forbidden')

        if (!userFamily.eventList.some(event => event.id === eventId)) throw new ForbiddenError('Forbidden')

        await EventItem.findByIdAndUpdate({ _id: eventId }, {
            $pullAll: {
                activityUpdateUsers: [context.userId],
                activityNewCommentUsers: [context.userId]
            }
        })
    } catch (e) {
        console.log(`Error fetching event comments, -> ${e}`)
        throw e
    }
}

export default removeNotifications