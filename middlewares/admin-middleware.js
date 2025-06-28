const isAdminUser = (req,res,next)=>{
    if(req.userInfo.role != 'admin'){
        return res.status(401).json({
            message:"You need admin role to access this page "
        })
    }
    next();
}

module.exports = isAdminUser;