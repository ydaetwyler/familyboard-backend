import { AuthenticationError } from 'apollo-server-express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { nanoid } from 'nanoid'

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

        return token
    } catch (e) {
        console.log(`Error reset password -> ${e}`)
        throw e
    }
}

export default resetPassword