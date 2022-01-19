import { nanoid } from 'nanoid'
import dotenv from 'dotenv'
import nodemailer from 'nodemailer'

dotenv.config()

const frontBaseUrl = process.env.FRONT_BASE_URL
const mailPw = process.env.MAIL_PW

const invite = async (args, context, Family, User) => {  
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const { _id, email } = args

        console.log(_id)

        const user = await new User({
            hash: nanoid(),
            userEmail: email,
            userName: nanoid(),
            password: nanoid(),
            active: false,
        })

        const newUser = await user.save()
        
        let updateFamily = await Family.findById({ _id })

        updateFamily.familyMembers.push(newUser.id)

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

        const currentUser = await User.findById({ _id: context.userId })
        const senderEmail = currentUser.userEmail

        const mailOptions = {
            from: 'familyboard@gmx.ch',
            to: email,
            subject: 'Family Board invitation',
            text: `You have been invited to join Family Board by ${senderEmail}. Click here to join: ${frontBaseUrl}/login/${user.hash}`
        }

        transport.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(`Error sending invitation mail -> ${error}`)
            } 
        })

    } catch (e) {
        console.log(`Error inviting User -> ${e}`)
        throw e
    }
}

export default invite