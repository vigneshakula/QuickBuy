import { useEffect, useState } from "react"
import Header from "../Header"
import Cookies from "js-cookie"
import CartListView from "../CartListView"
import EmptyCartView from "../EmptyCartView"
import CartSummary from "../CartSummary"
import "./styles.css"

const Cart = () => {

    const [state,updateState] = useState({isloading:true,failure:false,cart:{}})
    const [deleted,updateDeleted] = useState(false)
    const [showPopup, setShowPopup] = useState({flag:false,content:""})
    useEffect(() =>{
        const apiCall = async () => {
                    try{
                        const url = "http://localhost:8000/cart"
                        const response = await fetch(url,{
                            method:"GET",
                            headers : {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${Cookies.get("jwtToken")}`,
                            }
                        })
                        const data = await response.json()
                        if (response.status==200){
                            updateState((prevState) => ({isLoading:false,failure:false,cart:data.cartdetails}))
                        }
                        else{
                            updateState((prevState) => ({isLoading:false,failure:true,cart:{}}))
                        }
                }
                catch(e){
                    updateState((prevState) => ({isLoading:false,failure:true,cart:{}}))
                }
                finally{
                    updateState((prevState) => ({isLoading:false,failure:prevState.failure,cart:prevState.cart}))
                    }
                }
                apiCall()
            },[deleted])

        const onClickRemoveAllBtn = async () => {
            try{
                const url = "http://localhost:8000/cart/deleteproducts"
                const options = {
                    method:"DELETE",
                    headers:{
                        Authorization:"bearer "+Cookies.get("jwtToken"),
                        "Content-Type" : "application/json"
                    }
                }
                const response = await fetch(url,options)
                const data = await response.json();
                if (response.status==200){
                    updateDeleted(prevState => !prevState)
                }
            }
            catch(e){
                console.log("products are not deleted")
            }
        }

        const removeProductFromCart = async (cartproductid) => {
            try{
                const url = "http://localhost:8000/cart/deleteproduct"
                const options = {
                    method:"DELETE",
                    headers:{
                        Authorization:"bearer "+Cookies.get("jwtToken"),
                        "Content-Type" : "application/json"
                    },
                    body:JSON.stringify({
                        cartproductid
                    })
                }
                const response = await fetch(url,options)
                handlepopup("Item removed from the cart")
                const data = await response.json();
                if (response.status==200){
                    updateDeleted(prevState => !prevState)
                }
            }
            catch(e){
                console.log("product is not deleted")
            }
        }

        const checkout = async () =>{
            try{
                handlepopup("Order placed successfully")
                const {cartid} = state.cart
                const url = "http://localhost:8000/checkout"
                const options = {
                    method:"POST",
                    headers:{
                        Authorization:"bearer "+Cookies.get("jwtToken"),
                        "Content-Type" : "application/json"
                    },
                    body:JSON.stringify({
                        cartid
                    })
                }
                const response = await fetch(url,options)
                const data = await response.json();
                if (response.status==200){
                    updateDeleted(prevState => !prevState)
                    handlepopup("Order placed successfully")
                }
            }
            catch(e){
                console.log("order is not placed")
            }
        }
       
        const handlepopup =  (content) => {
            setShowPopup({flag:true,content:content})
            setTimeout(() => {
            setShowPopup({flag:false,content}); 
            }, 1000);
        };

            return (
                <>
                  <Header />
                  { !state.isloading && <div className="cart-container">
                    { state.cart.products.length===0? (
                      <EmptyCartView content={"Your Cart Is Empty"} />
                    ) : (
                      <div className="cart-content-container">
                        <h1 className="cart-heading">My Cart</h1>
                        <button
                          type="button"
                          className="remove-all-btn"
                          onClick={onClickRemoveAllBtn}
                        >
                          Remove All
                        </button>
                        {showPopup.flag && (
                                <div className="popup">
                                    {showPopup.content}
                                </div>
                        )}
                        <CartListView products={state.cart.products} removeProductFromCart={removeProductFromCart} />
                        <CartSummary total={state.cart.totalAmount} cartList={state.cart.products} checkout={checkout} />
                      </div>
                    )}
                  </div>}
                </>
              )
}

export default Cart