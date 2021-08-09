const {check_uname, check_password, check_type} = require('../model/users')
const {Create_car,update_cars, soft_delete} = require('../model/car')
const {all_transaction}= require('../model/transaction')
const router = require('express').Router()
const jwt = require('jsonwebtoken');
const {auth_admin} = require('../middleware/auth');

//routes
router.post("/Login",async(req,res)=>{
    try {
        const {username} = req.body
        //verification uname and password
        let uname_check = await check_uname(username)
        let passwod_check = await check_password(req)
        let type_check = await check_type(username)
        //jwt auth
        if(uname_check == 1 && passwod_check && type_check){
            const user_loggedin = {username:username}
            const token = jwt.sign(user_loggedin,process.env.ACCESS_TOKEN_SECRET,{expiresIn: '30m'})
            res.header('type','admin')
            res.header('auth-token',token).send("admin logged in")
        }else{
            res.send('Wrong Credential')
        }
    } catch (error) {
        console.log(error)
    }
})

router.post("/AddCar",auth_admin,async(req,res)=>{
    try {
        await Create_car(req)
        res.send("Car has been added")
    } catch (error) {
        console.log(error)
    }
})

router.post("/updateCar",auth_admin,async(req,res)=>{
    try {
        await update_cars(req)
        res.send('car has been updated')
    } catch (error) {
        
    }
})

router.post("/softdelete",auth_admin,async(req,res)=>{
    try {
        const{car_id} = req.body
        await soft_delete(car_id)
        res.send("Car sucessfully soft deleted")
    } catch (error) {
        console.log(error)
    }
})

router.get("/transaction",auth_admin,async(req,res)=>{
    try {
        data = await all_transaction()
        if (data == null){
            res.send("there's no transaction yet")
        }else{
            res.json(data)
        }
    } catch (error) {
        console.log(error)
    }
})

module.exports = router