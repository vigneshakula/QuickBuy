import { useEffect, useState } from "react"
import Header from "../Header"
import Cookies from "js-cookie"
import EmptyCartView from "../EmptyCartView"
import { Ring } from "react-awesome-spinners"
import OrderListView from "../OrderListView"
import "./styles.css"

const Orders = () => {

    const [state,updateState] = useState({isloading:true,failure:false,orders:[]})
    useEffect(() =>{
        const apiCall = async () => {
                    try{
                        const url = (Cookies.get("role")==="customer") ?"http://localhost:8000/user/orders" : "http://localhost:8000/seller/orders"
                        const response = await fetch(url,{
                            method:"GET",
                            headers : {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${Cookies.get("jwtToken")}`,
                            }
                        })
                        const data = await response.json()
                        if (response.status==200){
                            updateState((prevState) => ({isLoading:false,failure:false,orders:data.orders}))
                        }
                        else{
                            updateState((prevState) => ({isLoading:false,failure:true,orders:[]}))
                        }
                }
                catch(e){
                    updateState((prevState) => ({isLoading:false,failure:true,orders:[]}))
                }
                }
                apiCall()
            },[])

          const renderLoadingView = () => (
                  <div className="products-loader-container">
                    <Ring />
                  </div>
                )
        
            return (
                <>
                  <Header />
                  {state.isloading && renderLoadingView()}
                  { !state.isloading && <div className="cart-container">
                    { state.orders.length===0? (
                      <EmptyCartView content={"You haven't order anything yet"} />
                    ) : (
                      <div className="cart-content-container">
                        {Cookies.get("role")==="customer" ? <h1 className="cart-heading">My Orders</h1> :<h1 className="cart-heading">All Orders</h1>}
                        <OrderListView orders={state.orders}  />
                      </div>
                    )}
                  </div>}
                </>
              )
}

export default Orders