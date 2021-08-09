const {check_email, check_uname, create_user, check_password, update_balance, get_uid, buy_loan, prisma, get_data, payment} = require('../model/users')
const {all_cars} = require('../model/car')
const {all_transaction_spec_user,transaction_spec_id} = require('../model/transaction')
const router = require('express').Router()
const jwt = require('jsonwebtoken');
const { auth_user,decode_token } = require('../middleware/auth');
const {login,register,addCredit} = require('./../controller/user_controller')


//routes//
//login//
router.post("/Login",async(req,res)=>{
    try {
        await login(req,res)
    } catch (error) {
        console.error(error)
    }
})

//Register//
router.post("/Register",async(req,res)=>{
    try {
        await register(req,res)
    } catch (error) {
        console.error(error)
    }
})

router.get("/carlist",auth_user,async(req,res)=>{
    const data = await all_cars()
    res.json(data)
})

router.post("/topUp",auth_user,async(req,res)=>{
    try {
        await addCredit(req,res)
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