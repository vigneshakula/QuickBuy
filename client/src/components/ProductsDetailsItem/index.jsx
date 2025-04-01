import { useState,useEffect } from "react"
import "./styles.css"
import { Ring } from "react-awesome-spinners"
import Header from "../Header"
import Cookies from "js-cookie"
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import { useParams,Link } from "react-router-dom"
const ProductDetailsItem = () => {

    const [quantity,updateQuantity] = useState(1); 
    const [state,updateState] = useState({
        isLoading:true,
        failure:false,
        productDetail:{}
    })
    const [showPopup, setShowPopup] = useState(false);
     
    

    const {id} = useParams()

    useEffect( () => {
            const apiCall = async () => {
                try{
                    const url = `http://localhost:8000/product/${id}`
                    const response = await fetch(url,{
                        method:"GET",
                        headers : {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${Cookies.get("jwtToken")}`,
                        }
                    })
                    const data = await response.json()
                    if (response.status==200){
                        updateState((prevState) => ({isLoading:false,failure:false,productDetail:data.product}))
                    }
                    else{
                        updateState((prevState) => ({isLoading:false,failure:true,productDetail:{}}))
                    }
            }
            catch(e){
                updateState((prevState) => ({isLoading:false,failure:true,productDetail:{}}))
            }
            }
            apiCall()
        },[])
        

        const addProducttoCart = async () => {
            try{
                    const url = "http://localhost:8000/cart/addproduct"
                    const options = {
                        method : "POST",
                        headers: {
                            Authorization : "bearer "+Cookies.get("jwtToken"),
                            "Content-Type" :"application/json"
                        },
                        body:JSON.stringify({
                            productid:id,
                            quantity:quantity
                        })
                    }
                    const response = await fetch(url,options)
                    const data = await response.json()
                }
            catch(e){
               console.log(e.message);
            }
        }
        const handleAddToCart =  () => {
            addProducttoCart()
            setShowPopup(true)
            setTimeout(() => {
            setShowPopup(false); 
            }, 1000);
        };
    


    const renderLoadingView = () => (
        <div className="products-details-loader-container">
            <Ring />
        </div>
      )
    
      const renderFailureView = () => (
        <div className="product-details-error-view-container">
          <img
            alt="error view"
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
            className="error-view-image"
          />
          <h1 className="product-not-found-heading">Product Not Found</h1>
          <Link to="/products">
            <button type="button" className="button">
              Continue Shopping
            </button>
          </Link>
        </div>
      )
    
      const onDecrementQuantity = () => {
        if (quantity > 1) {
          updateQuantity(prevState => prevState-1)
        }
      }
    
     const onIncrementQuantity = () => {
        updateQuantity(prevState => prevState+1)
      }
    
    const renderProductDetailsView = () => {

        const {name,title,imageurl,rating,description,price,brand} = state.productDetail

            return   (<div className="product-details-success-view">
                <div className="product-details-container">
                  <img src={imageurl} alt="product" className="product-image" />
                  <div className="product">
                    <h1 className="product-name">{name}</h1>
                    <p className="price-details">Rs {price}/-</p>
                    <div className="rating-and-reviews-count">
                      <div className="rating-container">
                        <p className="rating">{rating}</p>
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                          alt="star"
                          className="star"
                        />
                      </div>
                    </div>
                    <p className="product-description">{description}</p>
                    <div className="label-value-container">
                      <p className="label">Brand:</p>
                      <p className="value">{brand}</p>
                    </div>
                    <hr className="horizontal-line" />
                    <div className="quantity-container">
                      <button
                        aria-label="Mute volume"
                        type="button"
                        className="quantity-controller-button"
                        onClick={onDecrementQuantity}
                        data-testid="minus"
                      >
                        <BsDashSquare className="quantity-controller-icon" />
                      </button>
                      <p className="quantity">{quantity}</p>
                      <button
                        type="button"
                        className="quantity-controller-button"
                        onClick={onIncrementQuantity}
                        data-testid="plus"
                        aria-label="Mute volume"
                      >
                        <BsPlusSquare className="quantity-controller-icon" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="button add-to-cart-btn"
                      onClick={handleAddToCart}
                    >
                      ADD TO CART
                    </button>
                    {showPopup && (
                                <div className="popup">
                                    Added to the cart
                                </div>
                        )}

                  </div>
                </div>
              </div>
            )
        }


        return (<>
            <Header />
            {state.isLoading && renderLoadingView()}
            {state.failure && renderFailureView()}
            {(!state.isLoading && !state.failure) && renderProductDetailsView()}
        </>)
}

export default ProductDetailsItem