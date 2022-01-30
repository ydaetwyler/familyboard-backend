import { AuthenticationError, ForbiddenError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const getEventComment = async (args, context, Comment) => {
    try {
        const contextReturn = await context

        if (!contextReturn.isAuth) {
            throw new AuthenticationError('Login necessary')
        }

        const { _id } = args

        const commentFetched = await Comment.findById({ _id: _id })
            .populate('commentOwner') 

        const commentFamilyId = commentFetched.familyId._id.toString()
        const userFamilyId = contextReturn.familyId.toString()

        if (commentFamilyId !== userFamilyId) throw new ForbiddenError('Forbidden')

        return commentFetched
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error fetching event comment',
            errorObject: e
        })
        throw e
    }
}

export default getEventComment