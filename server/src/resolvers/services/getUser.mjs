import { AuthenticationError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const getFamily = async (context, User) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const user = await User.findById({ _id: context.userId }, {'_id': 0})

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

export default getFamily