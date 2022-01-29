import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

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
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error setting event coordinates',
            errorObject: e
        })
        throw e
    }
}

export default setCoordinates