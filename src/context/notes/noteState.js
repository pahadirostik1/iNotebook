import React,{useState} from 'react';
import NoteContext from './noteContext';//NoteContext is local variable to store data exported from .noteContext file 
//This folder is mainly used to provide the context that we created in noteContext.js through importing 

const NoteState=(props)=>{
    const host="http://localhost:5000";
    const notesInitial=[]
     const [notes, setNotes] = useState(notesInitial);

      //Get all notes that is fetching all notes
      const getNote=async()=>{
        //TO do API Call that is required to add note in backend  not only from frontend mind it ,so it is left to do 
        //API Call that is server side 
        const url=`${host}/api/notes/fetchallnotes`;//taken from thunder client that is  upadating api in serverSide
        const response=await fetch(url,{
          method:"GET",
          headers:{
            "Content-Type":"application/json",
            "auth-token": localStorage.getItem('token')   
          }
         
        });
        const json=await response.json();
        setNotes(json);
      }


     //Add a Note
     const addNote=async(title,description,tag)=>{
      //TO do API Call that is required to add note in backend  not only from frontend mind it ,so it is left to do 
       //API Call that is server side 
       const url=`${host}/api/notes/addnotes`;//taken from thunder client that is  upadating api in serverSide
       const response=await fetch(url,{
         method:"POST",
         headers:{
           "Content-Type":"application/json",
           "auth-token": localStorage.getItem('token')        
          },
         body:JSON.stringify({title,description,tag})
       });
       const note=await response.json();
       setNotes(notes.concat(note));
    
     }

     //Delete a Note
     const deleteNote= async(id)=>{
       //TO do API Call that is deleting the note from backend also not only frontend mind it  and it is left to do
       const url=`${host}/api/notes/deletenote/${id}`;//taken from thunder client that is  upadating api in serverSide
       const response=await fetch(url,{
         method:"DELETE",
         headers:{
           "Content-Type":"application/json",
           "auth-token":localStorage.getItem('token')         
          }
        
        });
      const json=response.json();
      console.log(json);
      const newNotes= notes.filter((note)=>{ return note._id!==id});
      setNotes(newNotes);
        
     }

     //Edit a Note
     const editNote= async(id,title,description,tag)=>{
      //API Call that is server side 
      const url=`${host}/api/notes/updatenote/${id}`;//taken from thunder client that is  upadating api in serverSide
      const response=await fetch(url,{
        method:"PUT",
        headers:{
          "Content-Type":"application/json",
          "auth-token":localStorage.getItem('token')        
        },
        body:JSON.stringify({title,description,tag})
      });
     const json= await response.json(); 
     console.log(json);

      //Editing the Note in client-side that is only in interface only
      let newNotes=JSON.parse(JSON.stringify(notes));
       for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if(element._id===id){
          newNotes[index].title=title;
          newNotes[index].description=description;
          newNotes[index].tag=tag;
          break;
        }
        
      }
      setNotes(newNotes);
      
     }

    return(
         <NoteContext.Provider value={{notes,getNote,addNote,deleteNote,editNote}}> 
            {props.children}
        </NoteContext.Provider>
    )


}
export default NoteState;

