const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs');
const Salt_Round = 15

async function check_uname(username){
    const valid = await prisma.users.count({
        where: {
          username: username,
        },
    })
    return valid
}

async function check_email(email){
    const valid = await prisma.users.count({
        where: {
            email: email,
        },
    })
    return valid
}

async function create_user(req){
    const {first_name,last_name,username,password,email,address,phone_number} = req.body
    const hashed_pwd = await bcrypt.hash(password,Salt_Round)
    await prisma.users.create({
        data:{
            first_name,
            last_name,
            username,
            password: hashed_pwd,
            email,
            address,
            phone_number,
            user_type: false,
        },
    })
    
}

async function check_password(req){
    const{username,password} = req.body
    const hash = await prisma.users.findFirst({
        where:{
            username: username,
        },
    })
    try {
        if (await bcrypt.compare(password,hash.password)){
            return true
        }else return false
    } catch (error) {
        console.log("error")
    }
    
}

async function check_type(username){
    const valid = await prisma.users.findFirst({
        where:{
            username:username,
        },
    })
    return valid.user_type
}

async function update_balance(username,new_balance){
    await prisma.users.update({
        where:{username: username},
        data:{balance: new_balance},
    })
}
async function get_data(username){
    const data = await prisma.users.findUnique({
        where:{
            username:username
        }
    })
    return data
}

async function get_uid(username){
    const data = await prisma.users.findUnique({
        where:{
            username: username
        }
    })
    return data.uid
}

async function buy_loan(car_id,uid,quantity){
    const car_data = await prisma.cars.findUnique({
        where:{car_id:car_id}
    })
    await prisma.transactions.create({
        data:{
            quantity:quantity,
            date: new Date(),
            price:(quantity*car_data.car_cost),
            car_id: car_data.car_id,
            uid:uid
        }
    })
}


async function payment(transaction_id){
    await prisma.transactions.update({
        where:{
            transaction_id:transaction_id
        },
        data:{
            status:"Success"
        }
    })
}



module.exports={
    check_uname,
    check_email,
    create_user,
    check_password,
    check_type,
    update_balance,
    get_data,
    get_uid,
    buy_loan,
    prisma,
    payment
}