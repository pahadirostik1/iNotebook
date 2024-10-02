var jwt=require('jsonwebtoken');
const JWT_SECRET="ramhari@hero@dotcom";

const fetchUser=(req,res,next)=>{ //fetchUser is used to authenticate the user when request specific routes by them for notes
     //Get the use from the jwt token and add ID to req object 
    const token= req.header('auth-token');// at first we take the token from header by writing auth-token
    if(!token){  // if token is not present then we show the status access deniend that is 401 with some error message
        res.status(401).json({error:"Please authenticate using a valid token"})

    }// if token is present and we server get the token then we verify the token at firset
   try{
       const data =jwt.verify(token,JWT_SECRET);//verify the token including secret key and keep in data variable
       req.user= data.user;// verified token of user and users Id  is assigned to req.user and we are able to get verified token that contains the id of user
   
       next();//call the functin immediately after fetchUser() function mind it 
       

   }catch(error){
     res.status(401).json({error:"Please authenticate using a valid token"});
     
   }
}

module.exports=fetchUser;