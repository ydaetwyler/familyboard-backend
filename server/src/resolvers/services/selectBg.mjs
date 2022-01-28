import { AuthenticationError } from 'apollo-server-express'

const selectBg = async (args, context, User) => {
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }

    try {
        const { 
            selectedBgValue,
            selectedBgLabel
        } = args
        
        await User.findByIdAndUpdate({ _id: context.userId }, {
            selectedBgValue: selectedBgValue,
            selectedBgLabel: selectedBgLabel
        })

    } catch (e) {
        console.log(`Error updating user background -> ${e}`)
        throw e
    }
}

export default selectBg