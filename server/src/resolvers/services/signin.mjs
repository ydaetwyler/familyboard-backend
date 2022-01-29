import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AuthenticationError } from 'apollo-server-express'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'
import { sendAccessToken } from '../../utils/setCookie.mjs'

dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY

const signIn = async (args, context, User) => {
    try {
        const { email, password } = args
        const userPassword = password
        let userEmail

        if (email) {
            userEmail = email.trim().toLowerCase()
        }

        const userFetched = await User.findOne({ userEmail })
        
        if (!userFetched) {
            throw new AuthenticationError('Error signing in')
        }
        
        const match = await bcrypt.compare(userPassword, userFetched.password)
        
        if (!match) {
            throw new AuthenticationError('Error signing in')
        } else {
            // todo: set expire
            const token = jwt.sign({
                id: userFetched._id,
            },
            SECRET_KEY,
            )

            sendAccessToken(context[1], token)
        }
    } catch(e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error signin',
            errorObject: e
        })
        throw e
    }
}

export default signIn