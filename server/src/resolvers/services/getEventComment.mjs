import { AuthenticationError, ForbiddenError } from 'apollo-server-express'

const getEventComment = async (args, context, Comment) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const { _id } = args

        const commentFetched = await Comment.findById({ _id: _id })
            .populate('commentOwner') 

        const commentFamilyId = commentFetched.familyId._id.toString()
        const userFamilyId = context.familyId.toString()

        if (commentFamilyId !== userFamilyId) throw new ForbiddenError('Forbidden')

        return commentFetched
    } catch (e) {
        console.log(`Error fetching event comment, -> ${e}`)
        throw e
    }
}

export default getEventComment