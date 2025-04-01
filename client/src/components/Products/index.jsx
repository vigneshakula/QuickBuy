import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { Ring } from 'react-awesome-spinners'
import ProductCard from "../ProductCard"
import Header from "../Header"
import "./styles.css"

const Products = () => {
    const [state,updateState] = useState({
        isLoading:true,
        failure:false,
        prodcutsList:[]
    });
    useEffect( () => {
        const apiCall = async () => {
            try{
                const url = "http://localhost:8000/products"
                const response = await fetch(url,{
                    method:"GET",
                    headers : {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${Cookies.get("jwtToken")}`,
                    }
                })
                const data = await response.json()
                if (response.status==200){
                    updateState((prevState) => ({isLoading:false,failure:false,prodcutsList:data.products}))
                }
                else{
                    updateState((prevState) => ({isLoading:false,failure:true,prodcutsList:[]}))
                }
        }
        catch(e){
            updateState((prevState) => ({isLoading:false,failure:true,prodcutsList:[]}))
        }
        }
        apiCall()
    },[])

    const renderLoadingView = () => (
        <div className="products-loader-container">
          <Ring />
        </div>
      )
      const renderProductsView = () => {
        const shouldShowProductsList = state.prodcutsList.length > 0
        return shouldShowProductsList ? (
          <div className="all-products-container">
            <ul className="products-list">
              {state.prodcutsList.map(product => (
                <ProductCard productData={product} key={product.productid} />
              ))}
            </ul>
          </div>
        ) : (
          <div className="no-products-view">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
              className="no-products-img"
              alt="no products"
            />
            <h1 className="no-products-heading">No Products Found</h1>
            <p className="no-products-description">
              We could not find any products. 
            </p>
          </div>
        )
      
      }

      const renderFailureView = () => (
        <div className="products-error-view-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
            alt="all-products-error"
            className="products-failure-img"
          />
          <h1 className="product-failure-heading-text">
            Oops! Something Went Wrong
          </h1>
          <p className="products-failure-description">
            We are having some trouble processing your request. Please try again.
          </p>
        </div>
      )
    
    
    return (<>
        <Header />
        {state.isLoading && renderLoadingView()}
        {state.failure && renderFailureView()}
        {(!state.isLoading && !state.failure) && renderProductsView()}
    </>)
}

export default Products