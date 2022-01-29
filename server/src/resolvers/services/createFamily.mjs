import { nanoid } from 'nanoid'
import logger from '../../utils/logger.mjs'
import { fileURLToPath } from 'url'

const createFamily = async (args, Family, User) => {    
    try {
        const user = new User({
            hash: nanoid(),
            userEmail: nanoid(),
            userName: nanoid(),
            password: nanoid(),
            active: false,
        })

        const newUser = await user.save()

        const { familyName, familyAvatarUrl } = args
        const family = new Family({
            familyName,
            familyAvatarUrl
        })
        
        const newFamily = await family.save()

        await newFamily.familyMembers.push(newUser.id)

        await newFamily.save()

        newUser.family = newFamily.id

        await User.findByIdAndUpdate(newUser._id, {
            family: newFamily.id
        })

        return user.hash
    } catch (e) {
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error creating Family',
            errorObject: e
        })
        throw e
    }
}

export default createFamily