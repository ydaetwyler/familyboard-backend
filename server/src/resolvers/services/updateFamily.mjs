import { AuthenticationError } from 'apollo-server-express'

const updateFamily = async (args, context, User, Family) => {
    const { 
        familyName,
        familyAvatarUrl,
    } = args
    
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const user = await User.findById({ _id: context.userId })

        const familyId = user.family

        let updateFamily = await Family.findByIdAndUpdate({ _id: familyId }, {
            familyName,
            familyAvatarUrl
        })
    
        return updateFamily
    } catch(e) {
        console.log(`Error updating family name -> ${e}`)
        throw e
    }
}

export default updateFamily