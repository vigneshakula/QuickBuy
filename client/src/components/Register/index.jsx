import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import './styles.css'
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const Register = () => {
    const navigate = useNavigate();
    const [registrationState,updateState] = useState({flag:false,msg:""})
    const {register,handleSubmit,formState:{errors}} = useForm()
    if (Cookies.get("jwtToken")!==undefined) return <Navigate to="/" />
    const submitForm = async (data) => {
        try{  
            const {username,password,address,email} = data
            const url = 'http://localhost:8000/register'
            const options = {
            method: 'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({username,password,email,address}),
            }
            const response = await fetch(url, options)
            const resData = await response.json()
            if (response.status === 200) {
                updateState({flag:false,msg:""})  
                navigate("/login")

            } else {
            updateState({flag:true,msg:resData.msg})
            }
        }
        catch(e){
            console.log(e.message)
        }
      }

    return (
        <div className="login-form-container">
            
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
            className="login-img"
            alt="website login"
          />
          <form className="form-container" onSubmit={handleSubmit(submitForm)}>
            <h1 className='project-title'>QuickBuy</h1>
            <div className='input-container'>
                <label className="input-label" htmlFor="username">
                USERNAME
                </label>
                <input
                type="text"
                id="username"
                className="password-input-field"
                placeholder="username"
                {...register("username",{required:true,
                    minLength:{value:3,message:"Min length should be 3"}
                    ,maxLength:{value:20,message:"Max length should be 20"}})}
                />
                {errors.username && <p className="error-message">*{errors.username.message}</p>}
            </div>
            <div className='input-container'>
                <label className="input-label" htmlFor="password">
                    PASSWORD
                </label>
                <input
                type="text"
                id="password"
                className="password-input-field"
                placeholder="password"
                {...register("password",{required:true,
                    minLength:{value:6,message:"Min length should be 6"}
                    ,maxLength:{value:20,message:"Max value should be 20"}})}
                />
                {errors.password && <p className="error-message">*{errors.password.message}</p>}
            </div>
            <div className='input-container'>
                <label className="input-label" htmlFor="email">
                    EMAIL
                </label>
                <input
                type="mail"
                id="email"
                className="password-input-field"
                placeholder="email"
                {...register("email",{required:true,
                    pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email address',
                    }    
                })}
                />
                {errors.email && <p className="error-message">*{errors.email.message}</p>}
            </div>
            <div className='input-container'>
                <label className="input-label" htmlFor="address">
                    ADDRESS
                </label>
                <input
                type="text"
                id="address"
                className="password-input-field"
                placeholder="address"
                {...register("address",{required:true,
                    minLength:{value:10,message:"Min length should be 10"}
                    ,maxLength:{value:50,message:"Max length should be 50"}})}
                />
                {errors.address && <p className="error-message">*{errors.address.message}</p>}
            </div>
            {registrationState.flag && <p className="error-message">*{registrationState.msg}</p>}
            <button type="submit" className="login-button">
              Register
            </button>
            <Link to="/login"><p className='register-link'>Log in</p></Link>
          </form>
        </div>
      )
}

export default Register