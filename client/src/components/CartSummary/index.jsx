import "./styles.css"

const CartSummary = (props) =>{
    const {total,cartList,checkout} = props


    const placeOrder = () => {
        checkout()
    }
    return (
        <>
          <div className="cart-summary-container">
            <h1 className="order-total-value">
              <span className="order-total-label">Order Total:</span> Rs {total}
              /-
            </h1>
            <p className="total-items">{cartList.length} Items in cart</p>
            <button type="button" className="checkout-button d-sm-none" onClick={placeOrder} >
              Checkout
            </button>
          </div>
          <button type="button" className="checkout-button d-lg-none" onClick={placeOrder}>
            Checkout
          </button>
        </>
      )
}

export default CartSummary