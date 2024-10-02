import React,{useContext,useState,useEffect,useRef} from "react";
import NoteContext from '../context/notes/noteContext'
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";
const Notes = (props) => {
     const navigate=useNavigate();
    const context= useContext(NoteContext);
    const {notes, getNote,editNote}= context;
    useEffect(() => {
      if(localStorage.getItem('token')){//if token is not null  that means user is logged in  
          getNote();//we get the notes if he/she has valid token only otherwise not 
      }
      else{ //if token is null then at first login which means we direct to login pages and then other only 
        navigate('/login');
      }
       // eslint-disable-next-line
    }, [])

    const ref = useRef(null);//ref is used to reference the hidden button element in the DOM
    const refClose=useRef(null);
    const [note, setNote] = useState({id:" ",etitle:"",edescription:"",etag:"default"})

    const updateNote=(currentNote)=>{
      //edit button is clicked but reference is Launch demo model so when edit button is clicked it calls updateNote() 
      // and due to ref.current.click ,it triggers the Launch demo model and .click() makes click in that Launch demo model 
      //and open the modal 
     ref.current.click();// programmatically triggers a click on this button that is Launch demo modal button which is basically hidden , which opens the modal
     setNote({id:currentNote._id,etitle:currentNote.title,edescription:currentNote.description,etag:currentNote.tag});
     
    }
     
    const handleClick=(e)=>{
      editNote(note.id,note.etitle,note.edescription,note.etag);
      refClose.current.click();
      props.showAlert("Updated Successfully","success");
   
  }
  const onChange=(e)=>{
      setNote({...note,[e.target.name]:e.target.value})
  }
    
  return (
    <>
    <AddNote showAlert={props.showAlert}/>
      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Launch demo modal
      </button>

    <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
            <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
          <form className="my-3">
            <div className="mb-3">
                <label htmlFor="etitle" className="form-label">Title</label>
                <input type="text" className="form-control" id="etitle" name="etitle" value={note.etitle} aria-describedby="emailHelp" onChange={onChange}/>
              
            </div>
            <div className="mb-3">
                <label htmlFor="edescription" className="form-label">Description</label>
                <input type="text" className="form-control" id="edescription" name="edescription" value={note.edescription} onChange={onChange} minLength={5} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="etag" className="form-label">Tag</label>
                <input type="text" className="form-control" id="etag" name="etag" value={note.etag} onChange={onChange} minLength={5} required/>
            </div>
            
       </form>
          </div>
          <div className="modal-footer">
            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button disabled={note.etitle.length<5 || note.edescription.length<5} type="button" className="btn btn-primary" onClick={handleClick}>update Note</button>
          </div>
        </div>
      </div>
    </div>
    <div className="row my-3">
      <h2>Your Notes</h2>
      <div className='container mx-2'>
      {Array.isArray(notes) && notes.length===0 && "No any Notes to display"}
       </div>
      {Array.isArray(notes) && notes.map((note) => {
        return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note}/>; 
      })}
    </div>
  </>
  );
};

export default Notes;
 
    

            
