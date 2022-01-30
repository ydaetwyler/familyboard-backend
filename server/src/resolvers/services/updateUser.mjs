import { AuthenticationError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const updateUser = async (args, context, User) => {
    try {
        const contextReturn = await context

        if (!contextReturn.isAuth) {
            throw new AuthenticationError('Login necessary')
        }

        const { 
            username,
            avatarUrl
        } = args

        const newUser = await User.findByIdAndUpdate({ _id: contextReturn.userId }, {
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