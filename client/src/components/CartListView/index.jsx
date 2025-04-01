import "./styles.css"
import CartItem from "../CartItem"

const CartListView = (props) => {
    const {products,removeProductFromCart} = props
    return (
        <ul className="cart-list">
          {products.map(product => (
            <CartItem key={product.cartproductid} product={product} removeProductFromCart={removeProductFromCart} />
          ))}
        </ul>
      )
}

export default CartListView