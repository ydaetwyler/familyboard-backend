import { AuthenticationError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

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
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error updating user item',
            errorObject: e
        })
        throw e
    }
}

export default updateUser