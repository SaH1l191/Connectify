import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId, ref: "User", required: true
    },
    text: {
        type: String, maxLength: 500,
    },
    img: {
        type: String
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    // array directyl used for when it is to be made array of objects
    replies: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            text: {
                type: String,
                required: true
            },
            userProfilePic: {
                type: String,
            },
            username: {
                type: String
            }
        }
    ]
}, {
    timestamps: true
})


export default mongoose.model("Post", postSchema)