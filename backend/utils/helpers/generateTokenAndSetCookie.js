import jwt from "jsonwebtoken"



const generateTokenAndSetCookie = async(userId, res) => {
    const token =  jwt.sign({userId},
        process.env.JWT_SECRET, {expiresIn: "15d"}
    )

    res.cookie("accesstoken",token,{
        httpOnly: true, // more secure
		maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
		sameSite: "strict", // CSRF
    })

    return token
};


// some information about workflow :

//Where the Token and Cookie Are
// In the Cookie:
// The token is stored in the user's browser as an HTTP-only cookie named accesstoken.
//  Because it's marked as httpOnly, it cannot be accessed via JavaScript, which helps protect against XSS attacks.


export default generateTokenAndSetCookie