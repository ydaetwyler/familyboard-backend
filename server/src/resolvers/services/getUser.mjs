import { AuthenticationError } from 'apollo-server-express'

const getFamily = async (context, User) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }
    
    try {
        const user = await User.findById({ _id: context.userId }, {'_id': 0})

        return user
    } catch (e) {
        console.log(`Error fetching family, -> ${e}`)
        throw e
    }
}

export default getFamily