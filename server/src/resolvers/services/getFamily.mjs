import { AuthenticationError } from 'apollo-server-express'

const getFamily = async (context, User, Family) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const user = await User.findById({ _id: context.userId })

        const familyId = user.family

        const familyFetched = await Family.findById({ _id: familyId })
            .populate('familyMembers')
            .populate('eventList')
            .populate({
                path: 'eventList', select: 'activityDate', options: { sort: { activityDate: +1 } },
                populate: 'activityParticipantsList'
            })

        return familyFetched
    } catch (e) {
        console.log(`Error fetching family, -> ${e}`)
        throw e
    }
}

export default getFamily