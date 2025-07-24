import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Main from "./components/Main";
import PrivateRoute from "./components/PrivateRoute";
import Products from "./components/Products";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import SellerDashboard from "./components/SellerDashboard";
import AdminLogin from "./components/AdminLogin";
import MainSeller from "./components/MainSeller";
import AddProduct from "./components/AddProduct";
import PendingProducts from "./components/PendingProducts";
import MainAdmin from "./components/MainAdmin";
import SellerProducts from "./components/SellerProducts";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";

function App() {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        
        <Route
          path="/customer/dashboard"
          element={
            <PrivateRoute>
              <Main child={<Home />} />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/products"
          element={
            <PrivateRoute>
              <Main child={<Products />} />
            </PrivateRoute>
          }
        />
        <Route
          path="/customer/cart"
          element={
            <PrivateRoute>
              <Main child={<Cart />} />
            </PrivateRoute>
          }
        />
        <Route
          path="/seller/dashboard"
          element={
            <PrivateRoute>
              <MainSeller child={<SellerProducts />} />
            </PrivateRoute>
          }
        />
        <Route
          path="/seller/add-products"
          element={
            <PrivateRoute>
              <MainSeller child={<AddProduct />} />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <MainAdmin child={<PendingProducts />} />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
