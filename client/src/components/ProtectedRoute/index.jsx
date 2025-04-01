import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children}) => {
    if (Cookies.get("jwtToken")!==undefined){
        return children;
    }
      return <Navigate to="/login" />     
} 

export default ProtectedRoute

