import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { nanoid } from 'nanoid'
import { AuthenticationError, ApolloError } from 'apollo-server-express'
import { encrypt } from '../../utils/crypto.mjs'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

dotenv.config()
const SECRET_KEY = process.env.SECRET_KEY

const signUp = async (args, User) => {
    
    try {

        const { email, password, username, userHash, avatarUrl } = args
    
        const userEmail = email.trim().toLowerCase()
        const hashed = await bcrypt.hash(password, 10)

        const overwriteHash = nanoid()

        await User.findOneAndUpdate({ hash: userHash }, {
            userEmail: userEmail,
            password: hashed,
            userName: username,
            avatarUrl,
            hash: overwriteHash,
            active: true,
        })

        const user = await User.findOne({ hash: overwriteHash })

        if (!user) throw new AuthenticationError('User hash invalid')
        
        const token = jwt.sign({
            id: user._id,
        },
        SECRET_KEY,
        )

        const hash = encrypt(token)
        
        return JSON.stringify(hash)
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error signup',
            errorObject: e
        })
    }
}

export default signUp