import React ,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
const Signup = (props) => {
      const [credentials, setCredentials] = useState({name:"",email:"",password:"",cpassword:""})
      let navigate=useNavigate();//use it to navigate  to any pages or login option if user signup 
      const handleSubmit=async(e)=>{
        e.preventDefault();
        const url="http://localhost:5000/api/auth/uservalid";//taken from thunder client that is  upadating api in serverSide
        const {name,email,password}=credentials;
        const response=await fetch(url,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({name,email,password})
          
        });
        const json=await response.json();
        console.log(json); //we get the authToken of  user here after user enter name, email and password but no need to add confirmpassword

        if(json.success){ //if token we get that is if token is correct or valid 
          //save the token and redirect
          localStorage.setItem('token',json.authtoken);//save the token in localStorage which is provided by the browser
          navigate("/");//if token is correct than user login and they go to the Home page directly after login
          props.showAlert("Account Created Successfully","success") 
        }
        else{
       props.showAlert("Invalid Credentials","danger")
        }
      }
  const onChange=(e)=>{
    setCredentials({...credentials,[e.target.name]:e.target.value})
  }
    return (
      <div className='container mt-2'>
        <h2 className='my-2'>Create an account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp"/>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input type="email" className="form-control" id="email" name="email" onChange={onChange} aria-describedby="emailHelp"/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input type="password" className="form-control" id="password" name="password" onChange={onChange} minLength={5} required />
        </div>
        <div className="mb-3">
          <label htmlFor="cpassword" className="form-label">Confirm Password</label>
          <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onChange} minLength={5} required/>
        </div>
      
        <button type="submit" className="btn btn-primary">Submit</button>
    </form>
      </div>
    )
}

export default Signup
