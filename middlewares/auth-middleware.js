const jwt = require('jsonwebtoken');

const authMiddleware = (req,res,next)=>{
    console.log('Auth middleware runs');
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1];
    console.log('token is ',token)
    if(!token){
        return res.status(401).json({
            success:false,
            messsage:"Access denied, no token provided"
        })
    }
    // Decode the token
    try{
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
        console.log(decodedToken);
        req.userInfo = decodedToken;
        next();
    } 
    catch(e){
        return res.status(500).json({
            success:false,  
            messsage:"Access denied, no token provided"
        })
    }

}

module.exports = authMiddleware;