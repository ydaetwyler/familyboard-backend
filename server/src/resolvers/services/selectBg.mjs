import { AuthenticationError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const selectBg = async (args, context, User) => {
    try {
        const contextReturn = await context

        if (!contextReturn.isAuth) {
            throw new AuthenticationError('Login necessary')
        }
        
        const { 
            selectedBgValue,
            selectedBgLabel
        } = args
        
        await User.findByIdAndUpdate({ _id: contextReturn.userId }, {
            selectedBgValue: selectedBgValue,
            selectedBgLabel: selectedBgLabel
        })

    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error updating user background',
            errorObject: e
        })
        throw e
    }
}

export default selectBg