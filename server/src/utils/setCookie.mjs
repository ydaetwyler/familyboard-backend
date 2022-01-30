import dotenv from 'dotenv'

dotenv.config()

const NODE_ENV = process.env.NODE_ENV

export const sendAccessToken = async ({ res }, token) => {
    await res.cookie('userToken', token, {
        httpOnly: true,
        sameSite: true,
        secure: false,
        maxAge: (60*60*24),
        path: "/",
        domain: (process.env.NODE_ENV == 'development') ? "localhost" : "family-board.ch",
    })
}