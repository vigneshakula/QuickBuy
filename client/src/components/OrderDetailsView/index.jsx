import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Ring } from "react-awesome-spinners";
import Cookies from "js-cookie";
import Header from "../Header";
import CartListView from "../CartListView";
import OrderItem from "../OrderItem";
import OrderedProductsView from "../OrderedProductsView";
import OrderSummary from "../OrderSummary";


const OrderDetailsView = () => {
    const {id} = useParams();
    const [state,updateState] = useState({isloading:true,failure:false,order:{}})

    useEffect(()=>{
        const callApi = async () => {
                try{
                    const url = "http://localhost:8000/orders/"+id
                    const response = await fetch(url,{
                        method:"GET",
                        headers : {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${Cookies.get("jwtToken")}`,
                        }
                    })
                    const data = await response.json()
                    console.log(data)
                    if (response.status==200){
                        updateState((prevState) => ({isloading:false,failure:false,order:data.orderdetails}))
                    }
                    else{
                        updateState((prevState) => ({isloading:false,failure:true,order:{}}))
                    }
            }
            catch(e){
                console.log(e.message)
                updateState({isloading:false,failure:true,order:{}})
            }
        }
        callApi()
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
        {(!state.isloading && !state.failure)&& (
            <div className="cart-container">
            <div className="cart-content-container">
            <div>
               {Cookies.get("role")==="customer"&& <h1 className="cart-heading">Order #{state.order.orderNo}</h1> }
               {Cookies.get("role")!=="customer"&& <h2 >Order id - {state.order.orderid}</h2> }
                <h3 className="order-total-label">Ordered on {state.order.date}</h3>
                {Cookies.get("role")!=="customer" && <h3 className="order-total-label">Ordered by {state.order.orderedby}</h3>}
            </div>
            <OrderedProductsView products={state.order.products} />
            <OrderSummary cartList={state.order.products} total={state.order.totalAmount} />
        </div>
        </div>
        )}
        </>
    )
    
}

export default OrderDetailsView