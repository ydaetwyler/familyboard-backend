import { AuthenticationError } from 'apollo-server-express'

const setCoordinates = async (args, context, EventItem) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }

    try {
        const { 
            _id,
            activityCoordinates,
            activityApiCityNotFound,
        } = args

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