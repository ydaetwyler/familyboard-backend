import { AuthenticationError } from 'apollo-server-express'

const updateUser = async (args, context, User) => {
    const { 
        username,
        avatarUrl
    } = args
    
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }

    try {
        const newUser = await User.findByIdAndUpdate({ _id: context.userId }, {
            userName: username,
            avatarUrl
        })
    
        return newUser
    } catch (e) {
        console.log(`Error updating user name -> ${e}`)
        throw e
    }
}

export default updateUser