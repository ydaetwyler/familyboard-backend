import Log from '../models/log.mjs'

const logger = async data => {

    const logItem = await new Log({
        time: new Date(),
        file: data.file,
        message: data.message,
        errorObject: data.errorObject
    })

    await logItem.save()
}

export default logger