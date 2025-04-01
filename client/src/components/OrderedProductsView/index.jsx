import "./styles.css"
import CartItem from "../CartItem"
import OrderedProduct from "../OrderedProduct"
const OrderedProductsView = (props) => {
    const {products} = props
    return (
        <ul className="cart-list">
          {products.map(product => (
            <OrderedProduct key={product.cartproductid} product={product} />
          ))}
        </ul>
      )
}

export default OrderedProductsView