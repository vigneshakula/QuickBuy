import { useState } from 'react'
import Cookies from 'js-cookie';
import './styles.css'
import { Link, Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [showSubmitError,updateError] = useState({error:false,errorMsg:""});

    if (Cookies.get("jwtToken")!==undefined) return <Navigate to="/" />

    const submitForm = async event => {
        event.preventDefault()
        if (username==="" || password===""){
            updateError({error:true,errorMsg:"enter details correctly"})
        }
        else{
            
            const userDetails = {username:username, password:password}
            console.log(userDetails)
            const url = 'http://localhost:8000/login'
            const options = {
            method: 'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify(userDetails),
            }
            const response = await fetch(url, options)
            const data = await response.json()
            console.log(data)
            if (response.status === 200) {
                updateError({error:false,errorMsg:""})  
                Cookies.set("jwtToken",data.jwtToken)
                Cookies.set("role",data.role)
                navigate("/")

            } else {
            updateError({error:true,errorMsg:data.msg})
            }
        }
      }

    const renderUsernameField = () => {
        return (
          <>
            <label className="input-label" htmlFor="username">
              USERNAME
            </label>
            <input
              type="text"
              id="username"
              className="username-input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
            />
          </>
        )
      }
    
    const renderPasswordField = () => {
        return (
          <>
            <label className="input-label" htmlFor="password">
              PASSWORD
            </label>
            <input
              type="password"
              id="password"
              className="password-input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </>
        )
      }




    return (
        <div className="login-form-container">
            
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
            className="login-img"
            alt="website login"
          />
          <form className="form-container" onSubmit={submitForm}>
            <h1 className='project-title'>QuickBuy</h1>
            <div className="input-container">{renderUsernameField()}</div>
            <div className="input-container">{renderPasswordField()}</div>
            <button type="submit" className="login-button">
              Login
            </button>
            <Link to="/register"><p className='register-link'>don't have an account</p></Link>
            {showSubmitError.error && <p className="error-message">*{showSubmitError.errorMsg}</p>}
          </form>
        </div>
      )
}

export default Login