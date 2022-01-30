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
        logger({
            file: fileURLToPath(import.meta.url),
            message: 'Error DB connection',
            errorObject: e
        })
        throw e
    }
}

export default connect