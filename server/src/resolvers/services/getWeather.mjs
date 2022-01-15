import { AuthenticationError } from 'apollo-server-express'

const getWeather = async (args, context, EventItem) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const { _id } = args

        const eventItemFetched = await EventItem.findById({ _id: _id })

        return eventItemFetched
    } catch (e) {
        console.log(`Error fetching event item, -> ${e}`)
        throw e
    }
}

export default getWeather