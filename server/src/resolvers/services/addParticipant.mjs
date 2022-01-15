import { AuthenticationError } from 'apollo-server-express'

const removeParticipant = async (args, context, EventItem) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }

    try {
        const { 
            _id
        } = args

        await EventItem.findByIdAndUpdate({ _id: _id }, {
            $push: {
                activityParticipantsList: [context.userId]
            }
        })

    } catch (e) {
        console.log(`Error updating user name -> ${e}`)
        throw e
    }
}

export default removeParticipant