import express from 'express'
import {followUnFollowUser,
	getUserProfile,
	loginUser,
	logoutUser,
	signUpUser,
	updateUser,
	freezeAccount,
	getSuggestedUsers} from '../controller/userController.js'
import protectRoute from '../middleware/protectRoute.js'




const router = express.Router()

router.post("/signup", signUpUser)
router.put("/update/:id", protectRoute, updateUser);
router.post("/login", loginUser)
router.post("/logout", logoutUser) 
router.get("/profile/:query", getUserProfile);
router.post("/follow/:id", protectRoute, followUnFollowUser);
router.put("/freeze", protectRoute, freezeAccount);
router.get("/suggested", protectRoute, getSuggestedUsers);

export default router