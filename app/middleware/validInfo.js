module.exports =  (req,res,next) =>{
    const {email,name,password}= req.body;
console.log(req.body)
    function validEmail(userEmail){
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
    if(req.path === "/register"){
        if(![email,name,password].every(Boolean)){
            console.log("dkhalte hna 1")
            return res.status(401).json("missing credentials");

        } else if (!validEmail(email)){
            return res.status(401).json('invalide email ');
        }
    } else if (req.path === "/login"){
        if(![email,password].every(Boolean)){
            console.log("dkhalte hna 2")
          return res.status(401).json("missing credentials")  ;
        } else if (!validEmail(email)){
            return res.status(401).json('invalide email')
    }
}
next();
};