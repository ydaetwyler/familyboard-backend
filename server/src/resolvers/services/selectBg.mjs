import { AuthenticationError } from 'apollo-server-express'

const selectBg = async (args, context, User) => {
    const { 
        selectedBgValue,
        selectedBgLabel
    } = args
    
    if (!context.isAuth) {
        throw new AuthenticationError('Login necessary')
    }

    try {
        
        await User.findByIdAndUpdate({ _id: context.userId }, {
            selectedBgValue: selectedBgValue,
            selectedBgLabel: selectedBgLabel
        })

    } catch (e) {
        console.log(`Error updating user name -> ${e}`)
        throw e
    }
}

export default selectBg