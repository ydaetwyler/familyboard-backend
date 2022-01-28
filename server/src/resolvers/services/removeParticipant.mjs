import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

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
        console.log(`Error updating user name -> ${e}`)
        throw e
    }
}

export default removeParticipant