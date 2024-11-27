import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'
const protectRoute = async(req, res, next) => {

    try{
        const token = req.cookies.accesstoken;
        if(!token){
            return res.status(400).json({message: 'Unauthorized'})
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log("loggging decoded token here =  > > >>  ",decoded)

        //the decoded. remaining should be the same name as the one used while jwt.sign methode
        const user = await User.findById({ _id: decoded.userId }).select("-password")

        req.user = user 

        next()
    }
    catch (error){
        return res.status(500).json({message: error.message})    
    }



}
export default protectRoute;