import {Link} from 'react-router-dom'

import './styles.css'

const EmptyCartView = (props) => (
  <div className="cart-empty-view-container">
    <img
      src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-empty-cart-img.png"
      className="cart-empty-img"
      alt="cart empty"
    />
    <h1 className="cart-empty-heading">{props.content}</h1>

    <Link to="/products">
      <button type="button" className="shop-now-btn">
        Shop Now
      </button>
    </Link>
  </div>
)

export default EmptyCartView