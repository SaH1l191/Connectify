import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

export const createPost = async (req, res) => {
   try{
        let {postedBy , postText} = req.body;
        let { img } = req.body;

        if(!postText || !postedBy) return res.status(400).json({error: "Please enter all fields"})
        
        const user = await User.findById(postedBy)

        if(!user) return res.status(404).json({error: "User not found"})
        
        if(user._id.toString() !== req.user._id.toString()){
            return res.status(401).json({ error: "Unauthorized to create post" });
        }
        const maxlength = 500

        if(postText.length > maxlength){
            return res.status(400).json({ error: `Text must be less than ${maxLength} characters` });
        }

        if (img) {
			const uploadedResponse = await cloudinary.uploader.upload(img);
			img = uploadedResponse.secure_url;
		}
        const newPost = new Post({ postedBy, postText, img });
        await newPost.save()

        res.status(201).json(newPost);
        
   }
   catch(err){
    res.status(500).json({ error: err.message });
		console.log(err);
   }
   
};

export const deletePost =  async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}
        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(401).json({ message: "Unauthorized to delete post" })
        }

        if(post.img){
            const imgId = post.img.split("/").pop().split(".")[0];
			await cloudinary.uploader.destroy(imgId);
        }
        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Post deleted successfully" });

    }
    catch(err){
        res.status(500).json({ error: err.message });
		console.log(err);
    }
}

export const likeUnlikePost =  async (req, res) => {
    try{
        const {id:postId} = req.params;
        const userId  = req.user._id

        const post = await Post.findById(postId)

        if(!post){
            return res.status(404).json({ error: "Post not found" })
        }

        const userLikedPost = post.likes.includes(userId)

        if(userLikedPost){
            await Post.updateOne({ _id : postId}, {$pull:{likes:userId}})
            res.status(200).json({ message: "Post unliked successfully" });
        }
        else{
            post.likes.push(userId)
            await post.save()
            res.status(200).json({ message: "Post liked successfully" });
        }
    }   
    catch(err){
        res.status(500).json({ error: err.message });
		console.log(err);
    }
}
export const replyToPost =  async (req, res) => {
    try{

        const {text} = req.body;
        const postId = req.params.id 
        const userId =  req.user._id;
        const username = req.user.username 
        const userProfilePic = req.user.profilePic;

        if (!text) {
			return res.status(400).json({ error: "Text field is required" });
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(404).json({ error: "Post not found" });
		}

        const reply = {userId , text , userProfilePic , username}

        post.replies.push(reply)

        await post.save()

        res.status(200).json(reply)

    }
    catch(err){
        res.status(500).json({ error: err.message });
		console.log(err);
    }
}
export const getFeedPosts =  async (req, res) => {
    try{
        const userId = req.user._id;
        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({ error: "User not found" })
        }
        const following = user.following

        const feedPosts= await Post.find({postedBy : {$in : following}}).sort({createdAt : -1})

        res.status(200).json(feedPosts)

    }
    catch(err){
        res.status(500).json({ error: err.message });
		console.log(err);
    }
}
export const getPost=  async (req, res) => {
    try{
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({ error: "Post not found" })
        }
        res.status(200).json(post)
    }
    catch(err){
        res.status(500).json({ error: err.message });
		console.log(err);
    }
}
export const getUserPosts =  async (req, res) => {

    try{
        const {username} = req.params
        const user = await User.findOne({ username })
        if(!user){
            return res.status(404).json({ error: "User not found" })
        }
        const posts = await Post.find({postedBy : user._id}).sort({createdAt : -1})

        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json({ error: err.message });
		console.log(err);
    }
}