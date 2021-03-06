import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const createEventComment = async (args, context, Comment, EventItem, User, Family) => {
    try {
        const contextReturn = await context

        if (!contextReturn.isAuth) {
            throw new AuthenticationError('Login necessary')
        }

        const { 
            _id,
            commentText
        } = args

        const userFamily = await Family.findById({ _id: contextReturn.familyId })
            .populate('eventList')

        if (!userFamily.eventList) throw new ForbiddenError('Forbidden')

        if (!userFamily.eventList.some(event => event.id === _id)) throw new ForbiddenError('Forbidden')

        const comment = await new Comment({
            commentText,
            commentOwner: contextReturn.userId,
            familyId: contextReturn.familyId
        })

        await comment.save()

        await EventItem.findByIdAndUpdate({ _id: _id }, {
            $push: {
                comments: [comment]
            }
        })

        const user = await User.findById({ _id: contextReturn.userId })

        const familyId = await user.family

        const familyFetched = await Family.findById({ _id: familyId })
        const familyMembers = familyFetched.familyMembers

        await familyMembers.pull(contextReturn.userId)

        await EventItem.findByIdAndUpdate({ _id: _id}, {
            activityNewCommentUsers: familyMembers
        })
        
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error creating event comment',
            errorObject: e
        })
        throw e
    }
}

export default createEventComment