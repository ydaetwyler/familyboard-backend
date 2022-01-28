import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

const setWeather = async (args, context, Family, EventItem) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }

    try {
        const { 
            _id,
            activityApiLastCall,
            activityWeatherIcon,
            activityWeatherTemp,
            activityWeatherDesc,
            activityWeatherSunrise,
            activityWeatherSunset,
            activityWeatherWind,
        } = args

        const userFamily = await Family.findById({ _id: context.familyId })
            .populate('eventList')

        if (!userFamily.eventList) throw new ForbiddenError('Forbidden')

        if (!userFamily.eventList.some(event => event.id === _id)) throw new ForbiddenError('Forbidden')

        const updateEventItem = await EventItem.findByIdAndUpdate({ _id }, { 
            activityApiLastCall: activityApiLastCall,
            activityWeatherIcon: activityWeatherIcon,
            activityWeatherTemp: activityWeatherTemp,
            activityWeatherDesc: activityWeatherDesc,
            activityWeatherSunrise: activityWeatherSunrise,
            activityWeatherSunset: activityWeatherSunset,
            activityWeatherWind: activityWeatherWind,
        })

    } catch(e) {
        console.log(`Error updating event item -> ${e}`)
        throw e
    }
}

export default setWeather