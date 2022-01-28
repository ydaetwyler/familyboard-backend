import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const Pass = process.env.PASSWORD

const algorithm = 'aes-256-ctr'
const secretKey = Pass
const iv = crypto.randomBytes(16)

export const encrypt = (text) => {

    const cipher = crypto.createCipheriv(algorithm, secretKey, iv)

    const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    }
}

export const decrypt = (hash) => {

    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))

    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

    return decrpyted.toString();
}