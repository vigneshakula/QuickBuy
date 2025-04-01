import './App.css'
import {Routes,Route, BrowserRouter} from "react-router-dom"
import Header from './components/Header';
import Login from './components/Login';
import Home from './components/Home';
import Orders from './components/Orders';
import Cart from './components/Cart';
import Products from './components/Products';
import ProtectedRoute from './components/ProtectedRoute';
import ProductDetailsItem from './components/ProductsDetailsItem';
import OrderDetailsView from './components/OrderDetailsView';
import Register from './components/Register';
import AddProductView from './components/AddProductView';

const App = () => {
  return (
    <BrowserRouter>    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path='/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
      <Route path='/products' element={<ProtectedRoute><Products /></ProtectedRoute>} />
      <Route path='/addproduct' element={<ProtectedRoute><AddProductView /></ProtectedRoute>} />
      <Route path='/products/:id' element={<ProtectedRoute><ProductDetailsItem /></ProtectedRoute>} />
      <Route path='/orders/:id' element={<ProtectedRoute><OrderDetailsView /></ProtectedRoute>} />
    </Routes>
    </BrowserRouter>

  );
}

export default App
