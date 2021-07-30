require('dotenv').config()
const express = require('express')
const userRoute = require('./src/routes/user')
const adminRoute = require('./src/routes/admin')
const app = express();
const {auth_user} = require('./src/routes/auth')

app.use(express.json()) 

app.use('/api/user',userRoute)
app.use('/api/admin',adminRoute)

app.listen(3000,() => {
    console.log("API Running on Port 3000");
})

app.get("/",auth_user,(req,res) => {
    res.send("Hello!");
})
 