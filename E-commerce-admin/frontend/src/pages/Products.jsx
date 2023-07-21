import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BsFillTrash3Fill } from "react-icons/bs";
import { MdModeEdit } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    try {
      fetch(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
          import.meta.env.VITE_BACKEND_ADMIN_PORT
        }/products/get-products`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          response.json().then((result) => {
            setProducts(result?.products);
          });
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  }, []);

  const productId = uuidv4();

  return (
    <div className={"relative w-full h-full"}>
      <div
        className={
          "flex justify-between items-center dark:text-[#1f1f1f] text-white"
        }
      >
        <Link
          to={`/products/new-product/${productId}`}
          onClick={() => {
            localStorage.setItem("path", `/products/new-product/${productId}`);
          }}
          className={"btn-primary"}
        >
          Add new product
        </Link>
      </div>
      {products.length > 0 ? (
        <div
          className={
            "grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 mt-5 gap-2 text-white dark:text-[#1f1f1f] grid-cols-1"
          }
        >
          {products.map(
            ({ id, product_description, product_name, product_price }) => (
              <div
                key={id}
                className={
                  "p-2 rounded-md dark:bg-white bg-[#1f1f1f] justify-between flex flex-col"
                }
              >
                <div>
                  <p>{product_name}</p>
                  <p
                    className={
                      "h-8 text-ellipsis overflow-hidden whitespace-nowrap"
                    }
                  >
                    {product_description}
                  </p>
                  <p>{product_price}</p>
                </div>
                <div className={"flex items-center gap-5 my-1"}>
                  <Link
                    to={`/products/edit/${id}`}
                    className={
                      "flex items-center gap-1 p-1 dark:bg-[#1f1f1f] bg-white dark:text-white text-[#1f1f1f]  rounded-lg"
                    }
                  >
                    <MdModeEdit className={"w-5 h-5 rounded-md"} />
                    Edit
                  </Link>
                  <Link
                    to={`/products/delete/${id}`}
                    className={
                      "flex items-center gap-1 p-1 dark:bg-[#1f1f1f] bg-white dark:text-white text-[#1f1f1f]  rounded-lg"
                    }
                  >
                    <BsFillTrash3Fill className={"w-5 h-5 rounded-md"} />
                    Delete
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className={"centerClass font-bold"}>
          There are no products to show
        </div>
      )}
    </div>
  );
};

export default Products;
