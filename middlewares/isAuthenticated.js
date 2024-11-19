import jwt from "jsonwebtoken";
const isAuthenticated = async (req,res,next)=>{
    console.log("Cookie header:", req.cookies);
    console.log("token ==>",req.cookies.token)
    try {
        console.log("called ===>",req.cookies.token)
        const token = req.cookies.token;
        if(!token){ 
            return res.status(401).json({
                message:'User not authenticated',
                success:false
            });
        }
        const decode =  jwt.verify(token, process.env.SECRET_KEY);
        console.log("decode =>",decode);
        if(!decode){
            return res.status(401).json({
                message:'Invalid',
                success:false
            });
        }
        req.id = decode.userId;
        console.log("is authenticated =>",req.id)
        next();
    } catch (error) {
        console.log(error);
    }
}
export default isAuthenticated;