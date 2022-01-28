import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

const setCoordinates = async (args, context, Family, EventItem) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }

    try {
        const { 
            _id,
            activityCoordinates,
            activityApiCityNotFound,
        } = args

        const userFamily = await Family.findById({ _id: context.familyId })
            .populate('eventList')

        if (!userFamily.eventList) throw new ForbiddenError('Forbidden')

        if (!userFamily.eventList.some(event => event.id === _id)) throw new ForbiddenError('Forbidden')

        if (activityCoordinates) {
            await EventItem.findByIdAndUpdate({ _id }, { 
                activityCoordinates: activityCoordinates 
            })
        }

        if (activityApiCityNotFound) {
            await EventItem.findByIdAndUpdate({ _id }, { 
                activityApiCityNotFound: activityApiCityNotFound
            })
        }
    

    } catch(e) {
        console.log(`Error updating event item -> ${e}`)
        throw e
    }
}

export default setCoordinates