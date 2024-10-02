import React,{useState} from 'react'
import {useNavigate} from 'react-router-dom'
const Login = (props) => {
    const [credentials, setCredentials] = useState({email:"",password:""})
    let navigate=useNavigate();//use to if user login then we need to redirect to any pages
    const handleSubmit=async(e)=>{
        e.preventDefault();
        const url="http://localhost:5000/api/auth/login";//taken from thunder client that is  upadating api in serverSide
        const response=await fetch(url,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({email:credentials.email,password:credentials.password})
          
        });
        const json=await response.json();
       console.log(json); //we get the authToken of valid user here after user enter email and password
       if(json.success){ //if token we get that is if token is correct or valid 
             //save the token and redirect
             localStorage.setItem('token',json.authtoken);//save the token in localStorage which is provided by the browser
             props.showAlert("Logged in  Successfully","success") 
             navigate("/");//if token is correct than user login and they go to the Home page directly after login 
       }
       else{
        props.showAlert("Invalid Details","danger")
       }
     
    }
    const onChange=(e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    }
  return (
    <div className='mt-3'>
      <h2>Login to continue to iNotebook</h2>
     <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input type="email" className="form-control" id="email" value={credentials.email} onChange={onChange} name="email" aria-describedby="emailHelp"/>
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password"/>
        </div>
        <button type="submit" className="btn btn-primary" >Submit</button>
     </form>
    </div>
  )
}

export default Login
