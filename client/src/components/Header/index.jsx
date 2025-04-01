import './styles.css'
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
const Header = () => {

    const navigate = useNavigate()

    const onClickLogout = () =>{
        Cookies.remove("jwtToken")
        navigate("/login")
    }


    return (
        <nav className="nav-header">
          <div className="nav-content">
          <div className="nav-bar-mobile-logo-container">
          <Link to="/" className='custom-link' >
              <h1 className='project-title-nav'>QuickBuy</h1>
            </Link>
              <button
                type="button"
                className="nav-mobile-btn"
                onClick={onClickLogout}
              >
                <img
                  src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
                  alt="nav logout"
                  className="nav-bar-img"
                />
              </button>
            </div>
    
            <div className="nav-bar-large-container">
              
              <Link to="/" className='custom-link' >
                <h1 className='project-title-nav'>QuickBuy</h1>
              </Link>
              <ul className="nav-menu">
                <Link to="/" className='custom-link'>
                  <li className="nav-menu-item">
                      Home
                    </li>
                  </Link>
                <Link to="/products" className='custom-link'>
                  <li className="nav-menu-item">
                      Products
                    </li>
                </Link>
                {Cookies.get("role")==="seller" &&<Link to="/addproduct" className='custom-link' >
                  <li className="nav-menu-item">
                      Add Product
                    </li>
                </Link>}
                { Cookies.get("role")==="customer" && <Link to="/cart" className='custom-link'>
                  <li className="nav-menu-item">
                      Cart
                    </li>
                </Link>}
                <Link to="/orders" className='custom-link'>
                  <li className="nav-menu-item">
                      Orders
                    </li>
                </Link>
                
              </ul>
              <button
                type="button"
                className="logout-desktop-btn"
                onClick={onClickLogout}
              >
                Logout
              </button>
            </div>
          </div>
          <div className="nav-menu-mobile">
            <ul className="nav-menu-list-mobile">
              <Link to="/" className='custom-link' >
                <li className="nav-menu-item-mobile">
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-icon.png"
                      alt="nav home"
                      className="nav-bar-img"
                    />
                  </li>
                  </Link>
              <Link to="/products" className='custom-link' >
                <li className="nav-menu-item-mobile">
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-products-icon.png"
                      alt="nav products"
                      className="nav-bar-img"
                    />
                  </li>
                </Link>
              {Cookies.get("role")==="customer" &&<Link to="/cart" className='custom-link' >
                  <li className="nav-menu-item-mobile">
                      <img
                        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-icon.png"
                        alt="nav cart"
                        className="nav-bar-img"
                      />
                    
                    </li>
                </Link>}
                {Cookies.get("role")==="seller" &&<Link to="/addproduct" className='custom-link' >
                  <li className="nav-menu-item-mobile">
                      Add Product
                    </li>
                </Link>}
                <Link to="/orders" className='custom-link' >
                    <li className='nav-menu-items-mobile'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" className="bi bi-bag-check-fill icon-grey" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0m-.646 5.354a.5.5 0 0 0-.708-.708L7.5 10.793 6.354 9.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
                      </svg>

                    </li>
                </Link>
            </ul>
          </div>
        </nav>
      )
}

export default Header;