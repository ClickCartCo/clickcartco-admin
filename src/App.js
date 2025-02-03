import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Resetpassword from "./pages/Resetpassword";
import Forgotpassword from "./pages/Forgotpassword";
import MainLayout from "./components/MainLayout";
import Enquiries from "./pages/Enquiries";
import Orders from "./pages/Orders";
import Categorylist from "./pages/Categorylist";
import Productlist from "./pages/Productlist";
import Addcat from "./pages/Addcat";
import Couponlist from "./pages/Couponlist";
import AddCoupon from "./pages/AddCoupon";
import ViewEnq from "./pages/ViewEnq";
import ProtectedRoute from "./components/ProtectedRoute";
import AddProductV2 from "./pages/AddProductV2";
import UpdateProduct from "./pages/UpdateProduct";
import OrderDetails from "./pages/OrderDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/reset-password" element={<Resetpassword />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="order/:id" element={<OrderDetails />} />
            <Route path="list-category" element={<Categorylist />} />
            <Route path="category" element={<Addcat />} />
            <Route path="category/:id" element={<Addcat />} />
            <Route path="list-product" element={<Productlist />} />
            <Route path="product" element={<AddProductV2 />} />
            <Route path="product/:id" element={<UpdateProduct />} />
            {/* Future Functionalities 
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="enquiries/:id" element={<ViewEnq />} />
            <Route path="coupon-list" element={<Couponlist />} />
            <Route path="coupon" element={<AddCoupon />} />
            <Route path="coupon/:id" element={<AddCoupon />} /> */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
