const {check_email, check_uname, create_user, check_password, update_balance, get_uid, buy_loan, prisma, get_data, payment} = require('../model/users')
const jwt = require('jsonwebtoken');

async function login(req,res){
    try {
        const {username} = req.body
        //verification uname dan password
        let uname_check = await check_uname(username)
        let passwod_check = await check_password(req)
        //jwt auth
        if(uname_check == 1 && passwod_check == true){
            const user_loggedin = {username:username}
            const token = jwt.sign(user_loggedin,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '30m'})
            res.header('auth-token',token).send(token)
        }else{
            res.send('Wrong Credential')
        }
    } catch (error) {
        console.log(error)
    }
}

async function register(req,res){
    try {
        const {username,email} = req.body
        const valid_uname = await check_uname(username)
        const valid_mail = await check_email(email) 
        if(valid_uname < 1 && valid_mail < 1){
            await create_user(req)
            res.send("data successfully inserted")
        }else if(valid_uname == 1){
            res.send("sorry username not available")
        }else if(valid_mail > 0){
            res.send("Sorry email already used")
        }
    } catch (error) {
        console.error(error)
    }
}

async function addCredit(req,res){
    try {
        let {new_balance} = req.body
        const decode = decode_token(req)
        const username = decode.username
        const data = await get_data(username)
        new_balance = parseInt(new_balance) + parseInt(data.balance)
        await update_balance(username,new_balance)
        res.send("Balance succesfully added")
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    login,
    register,
    addCredit
}