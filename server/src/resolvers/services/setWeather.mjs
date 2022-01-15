import { AuthenticationError } from 'apollo-server-express'

const setWeather = async (args, context, EventItem) => {
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