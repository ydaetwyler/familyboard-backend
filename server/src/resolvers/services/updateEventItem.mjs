import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const updateEventItem = async (args, context, EventItem, User, Family) => {
    try {
        const contextReturn = await context

        if (!contextReturn.isAuth) {
            throw new AuthenticationError('Login necessary')
        }

        const { 
            _id,
            activityImageUrl,
            activityName,
            activityDescription,
            activityDate,
            activityLocation,
            activityAddress,
            activityUrl
        } = args

        const userFamily = await Family.findById({ _id: contextReturn.familyId })
            .populate('eventList')

        if (!userFamily.eventList) throw new ForbiddenError('Forbidden')

        if (!userFamily.eventList.some(event => event.id === _id)) throw new ForbiddenError('Forbidden')
    
        const eventItemBefore = await EventItem.findById({ _id: _id })

        if (activityImageUrl) {
            if (activityImageUrl !== eventItemBefore.activityImageUrl) {
                await EventItem.findByIdAndUpdate({ _id: _id }, {
                    activityImageUrl: activityImageUrl,
                })
            }
        }

        if (activityName) {
            if (activityName !== eventItemBefore.activityName) {
                await EventItem.findByIdAndUpdate({ _id: _id }, {
                    activityName: activityName,
                })
            }
        }
        
        if (activityDescription) {
            if (activityDescription !== eventItemBefore.activityDescription) {
                await EventItem.findByIdAndUpdate({ _id: _id }, {
                    activityDescription: activityDescription,
                })
            }
        }

        if (activityDate) {
            if (activityDate !== eventItemBefore.activityDate) {
                await EventItem.findByIdAndUpdate({ _id: _id }, {
                    activityApiLastCall: '',
                    activityDate: activityDate,
                })
            }
        }

        if (activityLocation) {
            if (activityLocation !== eventItemBefore.activityLocation) {
                await EventItem.findByIdAndUpdate({ _id: _id }, {
                    activityCoordinates: '',
                    activityApiCityNotFound: false,
                    activityApiLastCall: '',
                    activityLocation: activityLocation
                })
            }
        }

        if (activityAddress) {
            if (activityAddress !== eventItemBefore.activityAddress) {
                await EventItem.findByIdAndUpdate({ _id: _id }, {
                    activityAddress: activityAddress,
                })
            }
        }

        if (activityUrl) {
            if (activityUrl !== eventItemBefore.activityUrl) {
                await EventItem.findByIdAndUpdate({ _id: _id }, {
                    activityUrl: activityUrl,
                })
            }
        }

        const user = await User.findById({ _id: contextReturn.userId })

        const familyId = await user.family

        const familyFetched = await Family.findById({ _id: familyId })
        const familyMembers = familyFetched.familyMembers

        await familyMembers.pull(contextReturn.userId)

        await EventItem.findByIdAndUpdate({ _id: _id}, {
            activityUpdateUsers: familyMembers
        })
    } catch(e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error updating event item',
            errorObject: e
        })
        throw e
    }
}

export default updateEventItem
