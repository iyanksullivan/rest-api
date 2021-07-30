const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function Create_car(req){
    const{car_type,car_brand,car_color,production_year,car_cost,quantity} = req.body
    await prisma.cars.create({
        data:{
            car_type: car_type,
            car_brand : car_brand,
            car_color: car_color,
            production_year: production_year,
            car_cost: car_cost,
            quantity: quantity,
        },
    })
}

async function all_cars(){
    return await prisma.cars.findMany({
        where:{
            deleted:false,
        },
    })  
}

async function update_cars(req){
    const{car_cost,quantity,car_id} = req.body
    await prisma.cars.update({
        where:{
            car_id:car_id,
        },
        data:{
            car_cost: car_cost,
            quantity: quantity,
        },
    })
}

async function soft_delete(id){
    await prisma.cars.update({
        where:{
            car_id:id,
        },
        data:{
            deleted:true,
        }
    })
}

module.exports = {
    Create_car,
    all_cars,
    update_cars,
    soft_delete
}