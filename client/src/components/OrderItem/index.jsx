import { Link } from "react-router-dom"
import Cookies from "js-cookie"
import "./styles.css"
const OrderItem = (props) => {
    const {order} = props
    console.log(order)
    const {products,orderid,totalAmount,orderNo,date,orderedby} = order
    
    
    return (
      <Link to={`/orders/${orderid}`} className='custom-link'>
        <li className="order-item">
          <div className="cart-item-details-container">
            <div className="cart-product-title-brand-container">
              {Cookies.get("role")==="customer"  &&<h1 className="text-primary">Order #{orderNo}</h1>}
              {Cookies.get("role")!=="customer"  &&<h2 className="text-primary">Order id - <br/>
              
              <span className="cart-product-title">{orderid}</span></h2>}
              <p className="cart-product-title">total products : {products.length}</p>
            </div>
            <div className="total-price-remove-container-order">
              <p className="cart-total-price">total amount : Rs {totalAmount}/-</p>
              <p className="cart-product-title">ordered on {date}</p>
              {Cookies.get("role")!=="customer"  && <p className="cart-product-title">ordered by {orderedby}</p>}
            </div>
          </div>
        </li>
        </Link>
      )
}

export default OrderItem