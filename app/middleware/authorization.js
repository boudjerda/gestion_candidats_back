const jwt = require("jsonwebtoken");

module.exports = async (req,res,next) =>{
    console.log("verif token",req.header("Authorization"))
    try {
        const jwtToken = req.header("Authorization");
        if(!jwtToken){
           return res.status(403).json("not authorize !!!") 
        }
        const payload = jwt.verify(jwtToken,process.env.jwtSecret);
        req.user = payload.user;
        console.log("useeeer",req.user)
    } catch (err) {
        console.error(err.message);
        return res.status(403).json("not authorize!!!!!");
    }
    next();
}