import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";

import "./App.css";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Sittings from "./pages/Sittings";
import Error from "./pages/Error";
import NewProduct from "./pages/NewProduct";
import EditProduct from "./pages/EditProduct";
import DeleteProduct from "./pages/DeleteProduct";

function App() {
  return (
    <>
      <Routes>
        <Route path={"/login"} element={<Login />} />
        <Route path={"/"} exact Component={Layout}>
          <Route path={"/dashboard"} element={<Dashboard />} />
          <Route path={"/orders"} element={<Orders />} />
          <Route path={"/products"} element={<Products />} />
          <Route path={"/sittings"} element={<Sittings />} />
          <Route path={"/products/new-product/:id"} element={<NewProduct />} />
          <Route path={"/products/edit/:id"} element={<EditProduct />} />
          <Route path={"/products/delete/:id"} element={<DeleteProduct />} />
        </Route>
        <Route path={"*"} element={<Error />} />
      </Routes>
    </>
  );
}

export default App;
