import { nanoid } from 'nanoid'
import dotenv from 'dotenv'

dotenv.config()

const frontBaseUrl = process.env.FRONT_BASE_URL

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

        console.log(`${frontBaseUrl}/login/${user.hash}`)
    } catch (e) {
        console.log(`Error inviting User -> ${e}`)
        throw e
    }
}

export default invite