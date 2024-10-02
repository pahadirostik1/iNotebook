const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//ROUTE: 1  Get all the notes of user from database with the end point /api/notes/fetchallnotes using GET requests if user is loggin
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error Occurred here");
  }
});
//ROUTE: 2  Add all the notes of  using POST /api/notes/addnotes because initially notes are empty requests and login is required
router.post("/addnotes",fetchUser,
  [
    body("title", "Enter valid title").isLength({ min: 3 }),//we keep title and desription while creating notes
    body("description", "Enter description  of minimum 6 characters").isLength({min: 6})
    // body("tag", "Enter tag  of minimum 3 characters").isLength({min: 3}),
  ],
  async (req, res) => {
    try {
      //If there are errors then returns the Bad Request and the errors
      const { title, description, tag } = req.body; //we take out title,description and tag from request body that are enter by client
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        //simply returns the promise after doing .save()
        title,
        description,
        tag,
        user: req.user.id, //we keep id of user in user
      });
      const savedNote = await note.save(); //returns promise and save to the variable
     
      res.json(savedNote); //response the tne which are saved in response
    } 
     catch (error) {
      console.error(error.message);
      res.status(500).send("Some error Occurred here");
    }
  }
);

//Route:3: Update the existing note of user by that user only we have created that note using PUT: /api/notes/updateNote after login
router.put('/updateNote/:id',fetchUser,async(req,res)=>{
  const {title,description,tag}=req.body;
  try{

    //create a newNote Object,
    const newNote={};//An empty object newNote is created. It will hold the fields that need to be updated.
    // If title, description, or tag are provided, add them to newNote
     if(title){newNote.title=title};
     if(description){newNote.description=description};
     if(tag){newNote.tag=tag};
  
     //Find note and update it if the note is of the user what is login only , cant update notes of other user so 
     let  note= await Note.findById(req.params.id);// note to whom we want to upade based on id in document in database
     if(!note){ //if note note found for update that is if note is not present
        return res.status(404).send("Notes not found to update");
     }
     //if id requested by user doesnot match with the id in documents in database
     if(note.user.toString()!==req.user.id){//req.user.id is the verified token of user that is done in fetchUser.js file 
      return res.status(401).send("Not allowed");
     }
    // if id matches then user can allowed to update 
     note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true});//if user requests /updatenotes/123 then req.params.id store 123 value 
     res.send({note});
  }catch(error){
    console.error(error.message);
    res.status(500).send("Some error Occurred here");
  }
});

//Route:4: Deleting the existing Note using DELETE that is /api/notes/deletenote after login mind it so token and 
// authorization of user is requires so we have created fetchUser as middleware to take and verify the token 
router.delete('/deletenote/:id',fetchUser, async(req,res)=>{
  try{

    //Find note and delete it if the note is of the user what is login only , cant deletes notes of other user so 
  let  note= await Note.findById(req.params.id);// note to whom we want to delete based on id in document in database
  if(!note){ //if note note found for delete that is if note is not present
     return res.status(404).send("Notes not found to delete");
  }
  //if id requested by user doesnot match with the id in documents in database
  //That is allow deleting only if user owns this note
  if(note.user.toString()!==req.user.id){ //req.user.id is the verified token of user that is done in fetchUser.js file 
   return res.status(401).send("Not allowed");
  }
   // if id matches then user can allowed to delete
   note=await Note.findByIdAndDelete(req.params.id);
   res.send({"Success":"Note has been deleted",note:note});
  }catch(error){
    console.error(error.message);
    res.status(500).send("Some error Occurred here");
  }
})

module.exports = router;
