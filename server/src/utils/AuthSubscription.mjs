import { AuthenticationError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import logger from './logger.mjs'
import { fileURLToPath } from 'url'

import getCookie from './getCookie.mjs'

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

const AuthSubscription = async webSocket => {
    try {
        const cookies = webSocket.upgradeReq.headers.cookie

        const userToken = getCookie(cookies, 'userToken')

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
            message: 'Error authentication ws',
            errorObject: e
        })
        throw new AuthenticationError('Session invalid')
    }
}

export default AuthSubscription