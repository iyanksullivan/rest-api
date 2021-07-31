const {check_email, check_uname, create_user, check_password, update_balance, get_uid, buy_loan, prisma, get_data, payment} = require('./../../module/users')
const {all_cars} = require('./../../module/car')
const {all_transaction_spec_user,transaction_spec_id} = require('./../../module/transaction')
const router = require('express').Router()
const jwt = require('jsonwebtoken');
const { auth_user,decode_token } = require('./auth');

//routes//
//login//
router.post("/Login",async(req,res)=>{
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
})

//Register//
router.post("/Register",async(req,res)=>{
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
        console.log(error)
    }
})

router.get("/carlist",auth_user,async(req,res)=>{
    const data = await all_cars()
    res.json(data)
})

router.post("/topUp",auth_user,async(req,res)=>{
    try {
        let {new_balance} = req.body
        const decode = decode_token(req)
        const username = decode.username
        const data = await get_data(username)
        new_balance = parseInt(new_balance) + parseInt(data.balance)
        await update_balance(username,new_balance)
        res.send("Balance succesfully added")
    } catch (error) {
        console.log(error)
    }
    
})

router.post("/buy",auth_user,async(req,res)=>{
    try {
        const {car_id,quantity} = req.body
        const decode = decode_token(req)
        const username = decode.username
        const uid = await get_uid(username)
        const car_data = await prisma.cars.findUnique({
            where:{car_id:car_id}
        })
        if(quantity > car_data.quantity){
            res.send("quantity exceeding stock")
        }
        await buy_loan(car_id,uid,quantity)
        res.send("successfully added to your transaction")
    } catch (error) {
        console.log(error)
    }
})

router.get("/myTransaction",auth_user,async(req,res)=>{
    try {
        const decode = decode_token(req)
        const username = decode.username
        const uid = await get_uid(username)
        const data = await all_transaction_spec_user(uid)
        res.json(data)
    } catch (error) {
        console.log(error)
    }
})

router.post("/pay",auth_user,async(req,res)=>{
    try {
        const transaction_id = req.body.transaction_id
        const decode = decode_token(req)
        const username = decode.username
        const user_data = await get_data(username)
        const transaction_data = await transaction_spec_id(transaction_id)
        const uid = await get_uid(username)
        if (uid == transaction_data.uid){
            if(user_data.balance < transaction_data.price){
                res.send("Cannot make payment insufficient balance")
            }else{
                const new_balance = (user_data.balance - transaction_data.price)
                await payment(transaction_id)
                await update_balance(username,new_balance)
                res.send("payment successfull")
            }
        }else(
            res.send("different user cannot make payment")
        )
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;