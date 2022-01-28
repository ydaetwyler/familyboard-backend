import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { AuthenticationError } from 'apollo-server-express'
import { encrypt } from '../../utils/crypto.mjs'

dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY

const signIn = async (args, User) => {
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
            const token = jwt.sign({
                id: userFetched._id,
            },
            SECRET_KEY,
            )

            const hash = encrypt(token)

            return JSON.stringify(hash)
        }
    } catch(e) {
        console.log(`Error signin -> ${e}`)
        throw e
    }
}

export default signIn