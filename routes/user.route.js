const express=require('express')
const { userModel } = require('../models/user.model')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const userRouter=express.Router()

userRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        var alldata = await userModel.find({ email })
        if (alldata.length > 0) {
            res.send({ "msg": "email is alredy present in database" })
        } else {
            bcrypt.hash(password, 5, async function (err, hash) {
                if (err) {
                    res.send({ "msg": "something went wrong", "error": err.message })
                } else {
                    const user = new userModel({ name, email, password:hash })
                    await user.save()
                    res.send({ "msg": "New user has been registered" })
                }
            });
        }
    } catch (error) {
        res.send({ "msg": "something went wrong", "error": error.message })
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await userModel.find({ email })
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, function (err, result) {
                if (result) {
                    var token = jwt.sign({ userID: user[0]._id }, 'secrete', { expiresIn: '1h' });
                    res.cookie('token',token)
                    res.send({ "msg": "Login successful"})
                } else {
                    res.send({"msg":"wrong credentials","error":err.message})
                }
            });
        } else {
            res.send({"msg":"wrong credentials"})
        }
    } catch (error) {
        res.send({ "msg": "something went wrong", "error": error.message })
    }
})

module.exports={
    userRouter
}