import { AuthenticationError } from 'apollo-server-express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

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
        console.log(`req -> ${req}`)
        const userToken = req.cookies.userToken
        console.lop(`userToken -> ${userToken}`)

        if (!userToken) return { isAuth: false }

        const user = validateUser(userToken)
        console.log(`user -> ${user}`)

        const userExists = await User.findById({_id: user.id})
        console.log(`userExists -> ${userExists}`)

        if (userExists) {
            return { isAuth: true, userId: user.id }
        }
    } catch(e) {
        console.log(`error auth -> ${e}`)
    }
}

export default Auth