const express=require('express')
const { connection } = require('./config/db')
const { userRouter } = require('./routes/user.route')
const { blogRouter } = require('./routes/blog.route')
const { authenticate } = require('./middleware/authenticate')

require('dotenv').config();

const app=express()
app.use(express.json())

app.use('/api',userRouter)
app.use(authenticate)
app.use('/api',blogRouter)

app.listen(process.env.Port,async()=>{
    try {
        await connection
        console.log('Connected to Database');
    } catch (err) {
        console.log(err.message);
    } console.log(`Server is running on Port ${process.env.Port}`);
})