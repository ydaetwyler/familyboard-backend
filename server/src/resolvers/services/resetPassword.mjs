import { AuthenticationError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { nanoid } from 'nanoid'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'
import { sendAccessToken } from '../../utils/setCookie.mjs'

dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY

const resetPassword = async (args, User) => {
    try {
        const { password, userHash } = args

        const resetUser = await User.findOneAndUpdate({ hash: userHash }, {
            password: password,
            hash: nanoid()
        })

        if(!resetUser) {
            throw new AuthenticationError('Error user not found')
        }

        const token = jwt.sign({
            id: resetUser._id,
        },
        SECRET_KEY,
        )

        sendAccessToken(token)
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error reset password',
            errorObject: e
        })
        throw e
    }
}

export default resetPassword