import { AuthenticationError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import logger from './logger.mjs'
import { fileURLToPath } from 'url'

import User from '../models/user.mjs'

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

const validateUser = token => {
    if (token) {
        try {
            return jwt.verify(token, SECRET_KEY)
        } catch(e) {
            throw new AuthenticationError('Session invalid')
        }
    }
}

const Auth = async ({ req }) => {
    try {
        const userToken = await req.cookies.userToken

        if (!userToken) return { isAuth: false }

        const user = validateUser(userToken)

        const userExists = await User.findById({_id: user.id})

        if (userExists) {
            return { isAuth: true, userId: user.id, familyId: userExists.family }
        } else {
            return { isAuth: false }
        }
    } catch(e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error authentication http',
            errorObject: e
        })
        throw new AuthenticationError('Session invalid')
    }
}

export default Auth