import User from '../models/userModel.js';
import bcrypt from 'bcryptjs'
import generateTokenAndSetCookie from '../utils/helpers/generateTokenAndSetCookie.js';
import { v2 as cloudinary } from "cloudinary";
import mongoose from 'mongoose';
import Post from "../models/userModel.js"
export const signUpUser = async (req, res) => {
    try {
        console.log(req.body);
        const { name, email, username, password } = req.body;

        const user = await User.findOne({
            $or: [{ email }, { username }]
        });

        // const userByEmail = await User.findOne({ email });
        // const userByUsername = await User.findOne({ username });

        // const user = userByEmail || userByUsername;

        if (user) {
            return res.status(400).json({ error: "Email or username already exists" })
        }

        const salt = await bcrypt.genSalt(10); // generate a random string to be used as salt for the password hash function (see below)
        const hashedPassword = await bcrypt.hash(password, salt)


        const newUser = await User({
            name, email, username, password: hashedPassword
        })
        await newUser.save()

        if (newUser) {

            //passing res as cookie is set in res
            generateTokenAndSetCookie(newUser._id, res);

            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                username: newUser.username,
                bio: newUser.bio,
                profilePic: newUser.profilePic
            })
        } else {
            return res.status(400).json({ message: "Something went wrong while signing up the user" })
        }

    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

export const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid username or password" })
        }

        if (user.isFrozen) {
            user.isFrozen = false;
            await user.save();
        }

        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePic: user.profilePic
        }
        )

    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


export const logoutUser = async (req, res) => {

    try {
        res.cookie("accesstoken", "", {
            maxAge: 1 // 1 milisec
        })
        return res.status(200).json({
            message: "Logged out successfully"
        })

    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

export const followUnFollowUser = async (req, res) => {

    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id)

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You cannot follow yourself" })
        }
        if (!userToModify || !currentUser) {
            return res.status(400).json({ error: "Something went wrong while following the user" })
        }
        const isFollowing = currentUser.following.includes(id);

        if (isFollowing) {


            //When you pass this string to findByIdAndUpdate, Mongoose automatically converts the string 
            // to an ObjectId.
            //  This is because MongoDB’s _id field is typically stored as an ObjectId type.
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } })
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } })
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
            res.status(200).json({ message: "User followed successfully" });
        }


    }
    catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in followUnFollowUser: ", error.message);
    }

}


export const freezeAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        user.isFrozen = true;
        await user.save();

        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ error: err.message })
    }
}

export const getUserProfile = async (req, res) => {

    try {
        let user
        //query can be either username or userID 
        const { query } = req.params;

        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
        }
        else {
            user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
        }

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json(user);
    } catch (err) {

        res.status(500).json({ error: err.message })
    }
}

const updateUser = async (req, res) => {
    const { name, email, username, password, bio } = req.body;
    let { profilePic } = req.body;

    const userId = req.user._id;
    try {
        let user = await User.findById(userId);
        if (!user) return res.status(400).json({ error: "User not found" });

        if (req.params.id !== userId.toString())
            return res.status(400).json({ error: "You cannot update other user's profile" });

        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        if (profilePic) {
            if (user.profilePic) {
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]);
            }

            const uploadedResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedResponse.secure_url;
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;



        if (username || profilePic) {
            const allPosts = await Post.find();
            for (let post of allPosts) {
                let updated = false;

                // Ensure replies exist before proceeding
                if (Array.isArray(post.replies)) {
                    post.replies.forEach((reply) => {
                        if (reply.userId && reply.userId.equals(userId)) {
                            reply.username = user.username;
                            reply.userProfilePic = user.profilePic;
                            updated = true;
                        }
                    });
                }

                // Save post only if any reply was updated
                if (updated) await post.save();
            }
        }

        // Save updated user data
        const updatedUser = await user.save();

        // Prepare user response without password
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in updateUser: ", err.message);
    }
};



const getSuggestedUsers = async(req,res)=>{
    try{
        const userId = req.user._id;
        const usersFollowedByYou = await User.findById(userId).select("following");

        const users = await User.aggregate([
			{
				$match: {
					_id: { $ne: userId },
				},
			},
			{
				$sample: { size: 10 },
			},
		]);
        
        
        const filteredUsers = users.filter((user) => !usersFollowedByYou.following.includes(user._id));
		const suggestedUsers = filteredUsers.slice(0, 4);

		suggestedUsers.forEach((user) => (user.password = null));

		res.status(200).json(suggestedUsers);

    }
    catch(error){
        res.status(500).json({ error: error.message });
	}
}



export { updateUser ,getSuggestedUsers}

