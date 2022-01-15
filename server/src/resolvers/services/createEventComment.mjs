import { AuthenticationError } from 'apollo-server-express'

const createEventComment = async (args, context, Comment, EventItem, User, Family) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }

    try {
        const { 
            _id,
            commentText
        } = args

        const comment = await new Comment({
            commentText,
            commentOwner: context.userId
        })

        await comment.save()

        await EventItem.findByIdAndUpdate({ _id: _id }, {
            $push: {
                comments: [comment]
            }
        })

        const user = await User.findById({ _id: context.userId })

        const familyId = await user.family

        const familyFetched = await Family.findById({ _id: familyId })
        const familyMembers = familyFetched.familyMembers

        await familyMembers.pull(context.userId)

        await EventItem.findByIdAndUpdate({ _id: _id}, {
            activityNewCommentUsers: familyMembers
        })
        
    } catch (e) {
        console.log(`Error creating event comment -> ${e}`)
        throw e
    }
}

export default createEventComment