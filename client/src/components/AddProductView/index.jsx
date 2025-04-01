import Cookies from 'js-cookie';
import './styles.css'
import { Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Header from '../Header';

const AddProductView = () => {
    const navigate = useNavigate();
    const [state,updateState] = useState({flag:false,msg:""})
    const [showPopup, setShowPopup] = useState(false)
    const {register,handleSubmit,formState:{errors}} = useForm()
    if (Cookies.get("role")!=="seller") return <Navigate to="/" />
    const submitForm = async (data) => {
        try{  
            const {name,brand,price,description,imageurl,rating} = data
            const url = 'http://localhost:8000/seller/addproduct'
            const options = {
            method: 'POST',
            headers:{
                Authorization  : "bearer "+Cookies.get("jwtToken"),
                "Content-Type":"application/json"
            },
            body: JSON.stringify({name,brand,price,description,imageurl,rating}),
            }
            const response = await fetch(url, options)
            const resData = await response.json()
            console.log(resData)
            if (response.status === 200) {
                updateState({flag:false,msg:""})  
                handlepopup()

            } else {
            updateState({flag:true,msg:resData.msg})
            }
        }
        catch(e){
            console.log(e.message)
        }
      }

      
      const handlepopup =  () => {
        setShowPopup(true)
        setTimeout(() => {
        setShowPopup(false)
        navigate("/products") 
        }, 1000);
    };


    return (
        <>
            <Header />
        <div className="login-form-container">
          <form className="form-container" onSubmit={handleSubmit(submitForm)}>
            <h1 className='project-title add-product-heading'>Add Product</h1>
            <div className='input-container'>
                <label className="input-label" htmlFor="name">
                    Name
                </label>
                <input
                type="text"
                id="name"
                className="password-input-field"
                placeholder="Enter Product Name"
                {...register("name",{required:true,
                    minLength:{value:3,message:"Min length should be 3"}
                    ,maxLength:{value:20,message:"Max length should be 20"}})}
                />
                {errors.name && <p className="error-message">*{errors.name.message}</p>}
            </div>
            <div className='input-container'>
                <label className="input-label" htmlFor="brand">
                    Brand
                </label>
                <input
                type="text"
                id="brand"
                className="password-input-field"
                placeholder="enter brand"
                {...register("brand",{required:true,
                    minLength:{value:3,message:"Min length should be 2"}
                    ,maxLength:{value:20,message:"Max value should be 20"}})}
                />
                {errors.brand && <p className="error-message">*{errors.brand.message}</p>}
            </div>
            <div className='input-container'>
                <label className="input-label" htmlFor="description">
                    Description
                </label>
                <input
                type="text"
                id="description"
                className="password-input-field"
                placeholder="Enter Product description"
                {...register("description",{required:true,
                    minLength:{value:6,message:"Min length should be 6"}
                    ,maxLength:{value:400,message:"Max value should be 400"}
                })}
                />
                {errors.description && <p className="error-message">*{errors.description.message}</p>}
            </div>
            <div className='input-container'>
                <label className="input-label" htmlFor="price">
                    Price
                </label>
                <input
                type="text"
                id="price"
                className="password-input-field"
                placeholder="Enter price"
                {...register("price",{required:true,
                    minLength:{value:1,message:"Min length should be 10"}
                    ,maxLength:{value:15,message:"Max length should be 15"}})}
                />
                {errors.price && <p className="error-message">*{errors.price.message}</p>}
            </div>
            <div className='input-container'>
                <label className="input-label" htmlFor="imageurl">
                    Price
                </label>
                <input
                type="text"
                id="imageurl"
                className="password-input-field"
                placeholder="Enter image url"
                {...register("imageurl",{required:true})}
                />
                {errors.imageurl && <p className="error-message">*{errors.imageurl.message}</p>}
            </div>
            <button type="submit" className="login-button">
              Add
            </button>
            {showPopup && (
                                <div className="popup">
                                    Product added successfully
                                </div>
                        )}
          </form>
        </div>
        </>
      )
}

export default AddProductView