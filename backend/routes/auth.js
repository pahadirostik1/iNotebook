const express=require('express');
const User = require('../models/User');
const router=express.Router();
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const JWT_SECRET="ramhari@hero@dotcom";
const fetchUser=require("../middleware/fetchUser");

const {body,validationResult}=require('express-validator');

//ROUTE:1 here the path is /api/auth/uservalid as /api/auth is base route so after that the specific route is /uservalid,No login required
router.post("/uservalid",[
    body('name','Enter valid Name').isLength({min:3}),
    body('email','Enter valid Email').isEmail(),
    body('password',"Enter password of minimum 8 characters").isLength({min:8}),
], async(req,res)=>{
  let success=false;
    //If there are errors then returns the Bad Request and the errors 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success,errors: errors.array() });
    }
  
   try{ 
  //check whether the user with the same email exists already or not
    let user= await User.findOne({email:req.body.email});
    //if email is already exists then show the error
    if(user){
            return res.status(400).json({success,error:"This email already existes "});
    }
    const salt=await bcrypt.genSalt(10);
    const secPass=await bcrypt.hash(req.body.password,salt);

    //create a new user in mongodb if user doesnot exists 
    user =await User.create({
        name:req.body.name,
        password:secPass,
        email:req.body.email,
    });
    const data={
      user:{
          id:user.id
      } 
    }
    const authToken= jwt.sign(data,JWT_SECRET);
   success=true;
    res.json({success,authToken});
    // res.json(user);//response the user data we entered before in json format and respone it in as seen in thunder client Response part 
   }
   catch(error){
    console.error(error.message);
    res.status(500).send("Some error Occurred here");
   }

});

//ROUTE: 2 here the path is /api/auth/login as /api/auth is base route to Authenticate the user, No login required
router.post("/login",[
  body('email','Enter valid Email').isEmail(),
  body('password',"Password cannot be blank").exists(),
], async(req,res)=>{
  let success=false;
  //If there are errors then returns the Bad Request and the errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {email,password}=req.body;//take out the email and password enter by the user in request body in Thunder client
  try{ 
     //check whether the enter email exits in database or not
     let user= await User.findOne({email});// finding in User model that we have created and setting email:email
     if(!user){
      success=false;
      return res.status(400).json({success,error:"Please try to login with correct credentials"});
     }
     
     const passwordCompare= await bcrypt.compare(password,user.password);//compare the password enter by user in body with the password in database
     if(!passwordCompare){ // if the comparison done about password doesnot match then
      success=false;
      return res.status(400).json({success,error:"Please try to login with correct credentials"});
     }
     //if password compare is correct then we send the payload(data) of user and we send id to user in form of object

     const data={
      user:{   //we send the payload (data) of user and the data is only id mind it
        id:user.id
      }
     }
    const authToken= jwt.sign(data,JWT_SECRET);
    console.log(authToken);
    success=true;
    res.json({success,authToken});//respone is send as authToken:authToken as it is the shorthand of {authToken} 

    }catch(error){
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
 })
  
 //ROUTE-3:   Get loggin User details using POST:/api/auth/getUser ,Login required and server generate the id after receiving 
 // the token that is authToken in above  from client which was initially send by server that contains the id of client 


 router.post("/getUser",fetchUser, async(req,res)=>{ //fetchUser is the middleware function that executes when user request the endpoint 
  //that is /api/auth/getUser and fetchUser is file inside middlware folder and fetchUser is a function in that folder and 
  //it receivers req,res and next as parameter if next() is called then it runs the callback function that is after that , that is 
  // async(req,res)=>............
 
    try{
      const userId=req.user.id;
      const user=await User.findById( userId).select("-password");
       res.send({user});


     }catch(error){
      console.error(error.message);
      res.status(500).send("Internal Server Error");
     }
})
module.exports=router;
    
    
