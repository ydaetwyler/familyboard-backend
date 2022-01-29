import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const removeEventComment = async (args, context, Family, Comment, EventItem) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }

    try {
        const { commentId, _id } = args

        const userFamily = await Family.findById({ _id: context.familyId })
            .populate('eventList')

        if (!userFamily.eventList) throw new ForbiddenError('Forbidden')

        if (!userFamily.eventList.some(event => event.id === _id)) throw new ForbiddenError('Forbidden')

        const commentToRemove = await Comment.findById({ _id: commentId })

        const commentOwnerId = commentToRemove.commentOwner._id.toString()
        const userId = context.userId.toString()

        if (commentOwnerId !== userId) throw new ForbiddenError('Forbidden')

        await Comment.findByIdAndDelete({ _id: commentId })

        await EventItem.findByIdAndUpdate({ _id: _id }, {
            $pullAll: {
                comments: [commentToRemove._id]
            }
        })

    } catch(e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error removing event comment',
            errorObject: e
        })
        throw e
    }
}

export default removeEventComment