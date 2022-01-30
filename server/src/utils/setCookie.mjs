export const sendAccessToken = async ({ res }, token) => {
    await res.cookie('userToken', token, {
        httpOnly: true,
        sameSite: true,
        secure: false,
        maxAge: (60*60*24),
        path: "/"
    })
}