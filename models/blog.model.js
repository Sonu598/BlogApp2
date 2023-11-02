const mongoose=require('mongoose')

const blogSchema=mongoose.Schema({
    username:String,
    title:String,
    Content:String,
    Category:String,
    date:Date,
    likes:Number,
    Comments:{
        username:String,
        Content:String
    }
})

const BlogModel=mongoose.model('blogs',blogSchema)

module.exports={
    BlogModel
}