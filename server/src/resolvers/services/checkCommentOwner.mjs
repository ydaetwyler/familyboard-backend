import { AuthenticationError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const checkCommentOwner = async (args, context, Comment) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const { _id } = args

        const commentFetched = await Comment.findById({ _id: _id })
            .populate('commentOwner')

        return commentFetched.commentOwner.id === context.userId
            ?  true
            :  false

    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error fetching event comment',
            errorObject: e
        })
        throw e
    }
}

export default checkCommentOwner