import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";

const EditProduct = () => {
  const [existingName, setExistingName] = useState("");
  const [existingCategory, setExistingCategory] = useState("");
  const [existingDescription, setExistingDescription] = useState("");
  const [existingPrice, setExistingPrice] = useState("");
  const [existingImages, setExistingImages] = useState([]);

  const { id } = useParams();

  const productInformation = {
    existingName,
    existingCategory,
    existingDescription,
    existingPrice,
    id,
  };

  useEffect(() => {
    try {
      fetch(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
          import.meta.env.VITE_BACKEND_ADMIN_PORT
        }/products/edit/${id}`,
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
            setExistingName(result.product.product_name);
            setExistingCategory(result.product.product_category);
            setExistingDescription(result.product.product_description);
            setExistingPrice(result.product.product_price);
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
        import.meta.env.VITE_BACKEND_ADMIN_PORT
      }/products/edit/get-images/${id}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      if (response.ok) {
        response.json().then((result) => {
          setExistingImages(() => {
            const arrayImages = result.images.map((value, index) => {
              return result.images[index].image;
            });
            return arrayImages;
          });
        });
      }
    });
  }, [id]);

  useEffect(() => {
    localStorage.setItem("path", `/products/edit/${id}`);
  }, [id]);

  return (
    <div>
      <ProductForm
        pageTitle={"Edit Product"}
        fillTextShown={false}
        isCreateProduct={false}
        {...productInformation}
        existingImages={existingImages}
      />
    </div>
  );
};

export default EditProduct;
