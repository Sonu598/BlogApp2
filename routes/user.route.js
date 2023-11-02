const express=require('express')
const { userModel } = require('../models/user.model')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const userRouter=express.Router()

userRouter.post('/register',(req,res)=>{
    const {username,avatar,email,password}=req.body
    try {
        bcrypt.hash(password,5,async function(err,hash) {
            if (err) {
                res.send(err.message)
            } else {
                const user=new userModel({username,avatar,email,password:hash})
                await user.save()
                res.send('Successfully Registerd')
            }
        })
    } catch (err) {
        res.send(err.message)
    }
})

userRouter.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await userModel.find({email})
        if (user) {
            bcrypt.compare(password,user[0].password,function (err,result) {
                if (result) {
                    var token=jwt.sign({userID:user[0]._id},'secrete',{expiresIn:60})
                    var refreshToken=jwt.sign({userID:user[0]._id},'secrete',{expiresIn:300})
                    res.cookie('token',token)
                    res.cookie('refreshToken',refreshToken)
                    res.send('Login Successful')
                } else {
                    res.send('login Failed')
                }
            })
        } else {
            res.send('Login Failed')
        }
    } catch (err) {
        res.send(err.message)
    }
})

module.exports={
    userRouter
}