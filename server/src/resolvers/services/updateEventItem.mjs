import { AuthenticationError } from 'apollo-server-express'

const updateEventItem = async (args, context, EventItem, User, Family) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }

    try {
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

        const user = await User.findById({ _id: context.userId })

        const familyId = await user.family

        const familyFetched = await Family.findById({ _id: familyId })
        const familyMembers = familyFetched.familyMembers

        await familyMembers.pull(context.userId)

        await EventItem.findByIdAndUpdate({ _id: _id}, {
            activityUpdateUsers: familyMembers
        })
    } catch(e) {
        console.log(`Error updating event item -> ${e}`)
        throw e
    }
}

export default updateEventItem
