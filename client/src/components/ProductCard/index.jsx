import {Link} from 'react-router-dom'

import './styles.css'

const ProductCard = props => {
  const {productData} = props
  const {name, brand, imageurl, rating, price, productid} = productData

  return (
    <li className="product-item">
      <Link to={`/products/${productid}`} className="link-item">
        <img src={imageurl} alt="product" className="thumbnail" />
        <h1 className="title">{name}</h1>
        <p className="brand">by {brand}</p>
        <div className="product-details">
          <p className="price">Rs {price}/-</p>
          <div className="rating-container">
            <p className="rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star"
            />
          </div>
        </div>
      </Link>
    </li>
  )
}
export default ProductCard
