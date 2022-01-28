import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

const getEventComments = async (args, context, Family, EventItem) => {
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
            .populate({path: 'comments', select: 'createdAt', options: { sort: { createdAt: -1 } }})

        return eventItemFetched
    } catch (e) {
        console.log(`Error fetching event comments, -> ${e}`)
        throw e
    }
}

export default getEventComments