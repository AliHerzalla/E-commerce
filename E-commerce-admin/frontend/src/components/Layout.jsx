import { Outlet } from "react-router-dom";
import Nav from "../components/Nav.jsx";
import toast, { Toaster } from "react-hot-toast";
import { useContext, useEffect } from "react";
import { Context } from "../contextApi/contextApi.jsx";

const Layout = () => {
  const { isProductsUpdated } = useContext(Context);

  useEffect(() => {
    if (
      isProductsUpdated.status == true &&
      isProductsUpdated.message.length > 0
    ) {
      toast.success(isProductsUpdated.message, {
        duration: 2500,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        position: "bottom-right",
      });
    }
    if (
      isProductsUpdated.status == false &&
      isProductsUpdated.message.length > 0
    ) {
      toast.error(isProductsUpdated.message, {
        duration: 2500,
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
        position: "bottom-right",
      });
    }
  }, [isProductsUpdated]);

  return (
    <div className={"grid-container"}>
      <Nav />
      <div
        className={
          "p-4 dark:text-white text-[#1f1f1f] dark:bg-[#1f1f1f] bg-white transition-all duration-200 col-start-2 w-[100%] overflow-y-auto"
        }
      >
        <div>
          <Toaster />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
