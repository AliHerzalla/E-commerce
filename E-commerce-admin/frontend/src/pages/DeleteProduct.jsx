import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../contextApi/contextApi";

const DeleteProduct = () => {
  const { setIsProductsUpdated } = useContext(Context);

  const [product, setProduct] = useState([]);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
        import.meta.env.VITE_BACKEND_ADMIN_PORT
      }/products/get/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      response.json().then((result) => {
        setProduct(result.product);
      });
    });
  }, [id]);

  useEffect(() => {
    localStorage.setItem("path", `/products/delete/${id}`);
  }, [id]);

  const deleteProduct = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
          import.meta.env.VITE_BACKEND_ADMIN_PORT
        }/products/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        setIsProductsUpdated({ status: true, message: result.message });
        localStorage.setItem("path", "/products");
        navigate("/products");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const goBack = (event) => {
    event.preventDefault();
    localStorage.setItem("path", `/products`);
    navigate("/products");
  };

  return (
    <div className={"relative h-full"}>
      <h1
        className={
          "flex items-center justify-center absolute top-[35%] left-1/2 -translate-x-1/2 w-full text-center"
        }
      >
        Do you really want to delete product &nbsp;
        {product && product?.product_name} ?
      </h1>
      <div className={"centerClass justify-between gap-5"}>
        <button
          onClick={(event) => deleteProduct(event)}
          className={"btn-primary"}
        >
          Yes
        </button>
        <button onClick={(event) => goBack(event)} className={"btn-primary"}>
          No
        </button>
      </div>
    </div>
  );
};

export default DeleteProduct;
