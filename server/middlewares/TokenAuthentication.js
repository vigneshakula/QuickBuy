const jwt = require("jsonwebtoken");

const TokenAuthentication = async (req,res,next) =>{
    try{
        let jwtToken;
        const authHeader = req.headers['authorization'];
        if (authHeader!==undefined){
            jwtToken=authHeader.split(" ")[1];
            if (jwtToken!==undefined){
                jwt.verify(jwtToken,"QuickBuy",async (error,payload)=>{
                    if (error){
                        res.status(400).json({msg:"Invalid JWT Token"});
                    }
                    else{
                        req.payload=payload;
                        next();
                    }
                })
            }
        }
        else{
            res.status(400).json({msg:"Invalid JWT Token"});
        }
    }
    catch(e){
        res.status(500).json({msg:"something went wrong"});
    }

}

module.exports=TokenAuthentication;