import {AiFillCloseCircle} from 'react-icons/ai'
import "./styles.css"
const CartItem = (props) => {
    const {name,imageurl,brand,price} = props.product.product
    const {quantity,cartproductid} = props.product
    const totalPrice = quantity*price
    const onRemoveCartItem = () => {
      props.removeProductFromCart(cartproductid)
    }
    return (
        <li className="cart-item">
          <img className="cart-product-image" src={imageurl} alt={name} />
          <div className="cart-item-details-container">
            <div className="cart-product-title-brand-container">
              <p className="cart-product-title">{name}</p>
              <p className="cart-product-brand">by {brand}</p>
            </div>
            <div className="cart-quantity-container">
              <p className="cart-quantity">Quantity : {quantity}</p>
            </div>
            <div className="total-price-remove-container">
              <p className="cart-total-price">Rs {totalPrice}/-</p>
              <button
                className="remove-button"
                type="button"
                onClick={onRemoveCartItem}
              >
                Remove
              </button>
            </div>
          </div>
          <button
            className="delete-button"
            type="button"
            onClick={onRemoveCartItem}
            data-testid="remove"
          >
            <AiFillCloseCircle color="#616E7C" size={20} />
          </button>
        </li>
      )
}

export default CartItem