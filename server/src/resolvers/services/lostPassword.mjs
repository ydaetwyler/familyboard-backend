import { AuthenticationError } from 'apollo-server-express'
import dotenv from 'dotenv'

dotenv.config()
const FRONT_BASE_URL = process.env.FRONT_BASE_URL

const lostPassword = async (args, User) => {
    try {
        const { email } = args

        let userEmail

        if (email) {
            userEmail = email.trim().toLowerCase()
        }

        const userFetched = await User.findOne({ userEmail })

        if (!userFetched) {
            throw new AuthenticationError('Error user not found')
        }

        console.log(`Send Mail -> ${FRONT_BASE_URL}/reset/${userFetched.hash}`)

        return true
    } catch(e) {
        console.log(`Error signin -> ${e}`)
        throw e
    }
}

export default lostPassword