const express=require('express')
const { BlogModel } = require('../models/blog.model')
const blogRouter=express.Router()

blogRouter.post('/blogs',async(req,res)=>{
    const {username,title,content,category,date,likes,comments}=req.body
    try {
        const blog=new BlogModel({username,title,content,category,date,likes,comments})
        await blog.save()
        res.send('Blog has been posted')
    } catch (err) {
        res.send(err.message)
    }
})

blogRouter.get('/blogs',async(req,res)=>{
    const blogs=await BlogModel.find()
    res.send(blogs)
})

blogRouter.delete('/blogs/:id',async(req,res)=>{
    try {
        const blogid=req.params.id
        const blog=await BlogModel.findById(blogid)
        if (!blog) {
            res.send('Blog not found')
        } 
        if (blog.username!==req.user.username) {
            res.send('You are not authorised to delete')
        }
        await BlogModel.findByIdAndDelete(blogid)
        res.send('Blog deleted successfully')
    } catch (err) {
        res.send(err.message)
    }
})

blogRouter.put('/blogs/:id', async (req, res) => {
    try {
        const blogId = req.params.id;
        const { title, content, category } = req.body;
        const blog = await BlogModel.findById(blogId);
        if (!blog) {
            res.send('Blog not found');
        }
      
        if (blog.username !== req.user.username) {
            res.send('You are not authorized to edit this blog');
        }
        blog.title = title;
        blog.content = content;
        blog.category = category;
  
        await blog.save();
        res.send('Blog updated successfully');
        res.send(blog);
    } catch (err) {
        res.send(err.message)
    }
});
  

blogRouter.get('/blogs?category=', async (req, res) => {
    try {
        const { category } = req.query;
        const filteredBlogs = await BlogModel.find({ category });
        res.send(filteredBlogs);
    } catch (err) {
        res.send(err.message);
    }
});
  
module.exports={
    blogRouter
}