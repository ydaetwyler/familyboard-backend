import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()
const mongoUri = process.env.MONGO_URI

const connect = () => {
    try {
        mongoose.connect(mongoUri, {
            useNewUrlParser: true
        })
    } catch (e) {
        console.log(e)
    }
}

export default connect