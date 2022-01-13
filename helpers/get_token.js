 
//* Get Token from headers

const getToken = (req) => {
    const authHeaders = req.headers['authorization']
    const token = authHeaders && authHeaders.split(" ")[1]
    return token
}

module.exports = getToken;