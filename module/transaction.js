const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function all_transaction_spec_user(uid){
    const data = await prisma.transactions.findMany({
        where:{
            uid:uid
        }
    })
    return data
}
async function transaction_spec_id(transaction_id){
    const data = await prisma.transactions.findUnique({
        where:{
            transaction_id:transaction_id
        }
    })
    return data
}

async function all_transaction(){
    return await prisma.transactions.findMany()
}
module.exports = {
    all_transaction_spec_user,
    transaction_spec_id,
    all_transaction
}