import { AuthenticationError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const getUser = async (context, User) => {
    try {
        const contextReturn = await context

        if (!contextReturn.isAuth) {
            throw new AuthenticationError('Login necessary')
        }

        const user = await User.findById({ _id: contextReturn.userId }, {'_id': 0})

        return user
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error fetching user',
            errorObject: e
        })
        throw e
    }
}

export default getUser