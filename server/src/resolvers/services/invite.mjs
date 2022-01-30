import { AuthenticationError, ApolloError, ForbiddenError } from 'apollo-server-express'
import { nanoid } from 'nanoid'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

dotenv.config()

const frontBaseUrl = process.env.FRONT_BASE_URL
const mailPw = process.env.MAIL_PW

const invite = async (args, context, Family, User) => {      
    try {
        const contextReturn = await context

        if (!contextReturn.isAuth) {
            throw new AuthenticationError('Login necessary')
        }

        const { _id, email } = args

        const requestFamilyId = _id.toString()
        const userFamilyId = contextReturn.familyId.toString()

        if (requestFamilyId !== userFamilyId) throw new ForbiddenError('Forbidden')

        const checkIfExists = await User.exists({ userEmail: email })

        if (checkIfExists) throw new ApolloError('invite already exists', '91371')

        const user = await new User({
            hash: nanoid(),
            userEmail: email,
            userName: nanoid(),
            password: nanoid(),
            active: false,
        })

        const newUser = await user.save()
        
        let updateFamily = await Family.findById({ _id })

        await updateFamily.familyMembers.push(newUser.id)

        await updateFamily.save()

        newUser.family = updateFamily.id

        await User.findByIdAndUpdate(newUser._id, {
            family: updateFamily.id
        })

        const transport = nodemailer.createTransport({
            host: "mail.gmx.net",
            port: 587,
            secure: false,
            auth: {
                user: "familyboard@gmx.ch",
                pass: mailPw,
            },
        })

        const currentUser = await User.findById({ _id: contextReturn.userId })
        const senderEmail = currentUser.userEmail

        const mailOptions = {
            from: 'familyboard@gmx.ch',
            to: email,
            subject: 'Family Board invitation',
            text: `You have been invited to join Family Board by ${senderEmail}. Click here to join: ${frontBaseUrl}/login/${user.hash}`
        }

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                logger({
                    file: fileURLToPath(import.meta.url),
                    message: 'Error sending invitaion mail',
                    errorObject: error
                })
                throw new ApolloError('Could not send invitation mail', '7600')
            } 
        })

    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error inviting User',
            errorObject: e
        })
        throw e
    }
}

export default invite