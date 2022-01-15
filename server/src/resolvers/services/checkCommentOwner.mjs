import { AuthenticationError } from 'apollo-server-express'

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
        console.log(`Error fetching event comment, -> ${e}`)
        throw e
    }
}

export default checkCommentOwner