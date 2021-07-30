const jwt = require('jsonwebtoken')

function auth_user(req,res,next){
    const auth_token = req.header('auth-token')
    if(!auth_token) return res.status(401).send('No accesss')
    try {
        const verified = jwt.verify(auth_token,process.env.ACCESS_TOKEN_SECRET)
        req.user = verified
        next();
    } catch (err) {
        res.send('Invalid Token')
    }
}

function auth_admin(req,res,next){
    const auth_token = req.header('auth-token')
    const type = req.header('type')
    if(type != 'admin') return res.status(401).send('No accesss')
    if(!auth_token) return res.status(401).send('No accesss')
    try {
        const verified = jwt.verify(auth_token,process.env.ACCESS_TOKEN_SECRET)
        req.user = verified
        next();
    } catch (err) {
        res.send('Invalid Token')
    }
}

function decode_token(req){
    const usertoken = req.header('auth-token')
    const token = usertoken.split(' ')
    const decode = jwt.verify(token[0],process.env.ACCESS_TOKEN_SECRET)
    return decode
}

module.exports = {
    auth_user,
    auth_admin,
    decode_token
}