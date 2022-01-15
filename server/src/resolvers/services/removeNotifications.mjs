import { AuthenticationError } from 'apollo-server-express'

const removeNotifications = async (args, context, EventItem) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const { eventId } = args

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