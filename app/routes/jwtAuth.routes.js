module.exports = app => {
const router = require("express").Router()
const db = require("../models");
const User = db.users;
const bcrypt = require('bcrypt')
const jwtGenerator = require("../utils/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");
//registering
router.post("/register",validInfo,async(req,res) => {
    try{
        // 1. destructure the req.body 
        const {name,email,password} = req.body;
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound)
        const bcryptPassword = await bcrypt.hash(password,salt);
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: bcryptPassword, 
          };
        //2. check if user exist (if user existe then throw error)


         ///////////
         const existingUser = await User.findOne({ where: { email } });

            if (existingUser) {
            return res.status(401).json('user already existe');
            }



         ////////
         
        //3. Bcrypt the user password

 
     
        //4. enter the new user inside our database


     User.create(user)
     .then(data => {
       res.send(data);
     })
     
        //5. generating our jwt token 

    
    } catch (err){
         console.log(err.message);
         res.status(500).send('server error')
    }
})
 
router.post("/login",validInfo, async(req,res) => {
    try {
        //1. destructure the req.body
    const {email, password} = req.body;

    //2. check if user doesn't existe (if not then we throw error)
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
        return res.status(401).json('Password or email is incorrect ')
    }

    //3. check if incomming is the same the database password 
    const validPassword =await  bcrypt.compare(password, existingUser.dataValues.password)
    if(!validPassword){
        return res.status(401).json('Password or email is incorrect ')
    }

    // 4. give them jwt token 
    const token = jwtGenerator(existingUser.dataValues.id);
    res.json({token})
    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error')
    }
})
router.get("/is-verify",authorization,async(req,res)=>{
    try {
        res.json(true);
    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error')
    }
})

app.use("/api/jwtAuth", router);
}