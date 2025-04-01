import "./styles.css"

const OrderSummary = (props) =>{
    const {total,cartList} = props
    return (
        <>
          <div className="cart-summary-container">
            <h1 className="order-total-value">
              <span className="order-total-label">Order Total:</span> Rs {total}
              /-
            </h1>
            <p className="total-items">{cartList.length} Items in cart</p>
          </div>
        </>
      )
}

export default OrderSummary