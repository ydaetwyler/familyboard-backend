import { AuthenticationError } from 'apollo-server-express'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

dotenv.config()
const FRONT_BASE_URL = process.env.FRONT_BASE_URL
const mailPw = process.env.MAIL_PW

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

        const transport = nodemailer.createTransport({
            host: "mail.gmx.net",
            port: 587,
            secure: false,
            auth: {
                user: "familyboard@gmx.ch",
                pass: mailPw,
            },
        })

        const mailOptions = {
            from: 'familyboard@gmx.ch',
            to: userEmail,
            subject: 'Family Board reset pw',
            text: `Click here to set a new password: ${FRONT_BASE_URL}/reset/${userFetched.hash}`
        }

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger({
                    file: fileURLToPath(import.meta.url),
                    message: 'Error sending pw reset mail',
                    errorObject: error
                })
            } 
        })

        return true
    } catch(e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error sending pw reset link',
            errorObject: e
        })
        throw e
    }
}

export default lostPassword