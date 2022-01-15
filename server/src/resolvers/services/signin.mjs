import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-express'

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

            return token
        }
    } catch(e) {
        console.log(`Error signin -> ${e}`)
        throw e
    }
}

export default signIn