import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { Context } from "../contextApi/contextApi";
import ProductImagesSection from "./ProductImagesSection";

const ProductForm = ({
  pageTitle,
  fillTextShown,
  isCreateProduct,
  existingName,
  existingDescription,
  existingPrice,
  id,
  existingImages,
  existingCategory,
}) => {
  const { setIsProductsUpdated } = useContext(Context);

  const [productName, setProductName] = useState("");
  const [productCategory, setProductCategory] = useState("0");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();
  const { id: productId } = useParams();

  useEffect(() => {
    if (id) {
      setProductName(existingName);
      setProductCategory(existingCategory);
      setProductDescription(existingDescription);
      setProductPrice(existingPrice);
      setProductImages(() => {
        return existingImages;
      });
    }
  }, [
    existingName,
    existingDescription,
    existingPrice,
    existingImages,
    id,
    existingCategory,
  ]);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
        import.meta.env.VITE_BACKEND_ADMIN_PORT
      }/categories/get-all-categories`,
      {
        method: "GET",
      }
    )
      .then((response) =>
        response.json().then((result) => {
          const categoriesArray = result.result
            .filter((categoryName) => categoryName.parent_category == 0)
            .map((category) => category);
          setCategories(categoriesArray);
        })
      )
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const createProduct = async (event) => {
    event.preventDefault();
    const productData = {
      productName,
      productDescription,
      productPrice,
      productImages,
      productCategory,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
          import.meta.env.VITE_BACKEND_ADMIN_PORT
        }/products/new-product/${productId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );
      response
        .json()
        .then((result) => {
          if (response.ok) {
            setIsProductsUpdated({
              status: true,
              message: result.message,
            });

            navigate("/products");
            localStorage.setItem("path", "/products");
          } else {
            setIsProductsUpdated({
              status: false,
              message: result.message,
            });
            navigate("/products");
            localStorage.setItem("path", "/products");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
    setProductName("");
    setProductCategory("");
    setProductDescription("");
    setProductPrice("");
    setProductImages([]);
  };

  const updateProduct = async (event) => {
    event.preventDefault();
    const productData = {
      productName,
      productDescription,
      productPrice,
      productCategory,
    };
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
          import.meta.env.VITE_BACKEND_ADMIN_PORT
        }/products/edit/${id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData),
        }
      );
      response
        .json()
        .then(async (result) => {
          if (response.ok) {
            if (productImages.length > 0) {
              const response = await fetch(
                `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
                  import.meta.env.VITE_BACKEND_ADMIN_PORT
                }/products/add-new-product-images/${id}`,
                {
                  method: "PUT",
                  credentials: "include",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ productImages }),
                }
              );
              await response.json();
            }

            setIsProductsUpdated({
              status: true,
              message: result.message,
            });
            localStorage.setItem("path", "/products");
            navigate("/products");
          } else {
            setIsProductsUpdated({
              status: false,
              message: result.message,
            });
            localStorage.setItem("path", "/products");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;

    if (inputValue.length <= 8 && parseFloat(inputValue) <= 99999.99) {
      setProductPrice(inputValue);
    }
  };

  const addNewProductImage = (event) => {
    event.preventDefault();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = false;
    fileInput.max = 20;
    fileInput.accept = ".jpg, .jpeg, .png, .webp";
    fileInput.addEventListener("change", async () => {
      setIsImageLoading(true);
      const files = fileInput.files;
      if (files.length > 20) {
        toast.error("The maximum number of images is 20", {
          duration: 2500,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
          position: "bottom-right",
        });
        return;
      }
      if (files.length > 0) {
        const filesData = new FormData();
        for (const file of files) {
          filesData.append("image", file);
        }
        try {
          setIsImageLoading(true);
          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_ADMIN_URL}${
              import.meta.env.VITE_BACKEND_ADMIN_PORT
            }/products/add-products-images`,
            {
              method: "POST",
              body: filesData,
            }
          );
          response.json().then((result) => {
            if (response.ok) {
              setIsProductsUpdated({
                status: true,
                message: result.message,
              });
              setTimeout(() => {
                setIsImageLoading(false);
                setProductImages([...productImages, result.image]);
              }, 2000);
            } else {
              setIsProductsUpdated({
                status: false,
                message: result.message,
              });
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
    fileInput.click();
  };

  const removeImageButton = (event, imageIndex) => {
    event.preventDefault();
    if (isCreateProduct) {
      const newImages = productImages.filter(
        (value, index) => index != imageIndex
      );
      setProductImages(newImages);
    } else {
      const newImages = productImages.filter(
        (value, index) => index != imageIndex
      );
      setProductImages(newImages);
    }
  };

  return (
    <form
      onSubmit={(event) =>
        isCreateProduct ? createProduct(event) : updateProduct(event)
      }
    >
      <div className={"flex justify-between items-center"}>
        <h2 className={"hOneHeader"}>{pageTitle}</h2>
        <Link
          to={"/products"}
          className={"btn-primary"}
          onClick={() => {
            localStorage.setItem("path", `/products`);
          }}
        >
          Back
        </Link>
      </div>
      <label>Product Name</label>
      <input
        type="text"
        className={"input"}
        placeholder={"Product Name"}
        value={productName}
        onChange={(event) => setProductName(event.target.value)}
      />
      <label>Category name</label>
      <select
        className={"input w-fit"}
        style={{
          marginLeft: "10px",
          width: "fit-content",
          padding: "5px 35px 5px 10px",
          marginTop: "10px",
        }}
        value={productCategory}
        onChange={(event) => setProductCategory(event.target.value)}
      >
        <option value="0">Uncategorized</option>
        {categories.map((category) => (
          <option value={category.id} key={category.id}>
            {category.category_name}
          </option>
        ))}
      </select>

      <ProductImagesSection
        images={productImages ? productImages : []}
        addNewProductImage={addNewProductImage}
        removeImageButton={removeImageButton}
        isImageLoading={isImageLoading}
      />

      <label>Product Description</label>
      <textarea
        className={"textarea"}
        placeholder={"Product Description"}
        value={productDescription}
        onChange={(event) => setProductDescription(event.target.value)}
      />
      <label>Price in (USD)</label>
      <input
        type="number"
        placeholder={"Product Price"}
        className={"input"}
        min={0}
        value={productPrice}
        onChange={(event) => handleInputChange(event)}
      />
      <div>
        <button
          type={"submit"}
          className={
            "btn-primary disabled:cursor-not-allowed disabled:bg-[#b3b3b355] disabled:text-[#1f1f1f] disabled:dark:text-white"
          }
          disabled={!productName || !productDescription || !productPrice}
        >
          Save
        </button>
        {fillTextShown && (
          <p>You must fill all the fields to save the product</p>
        )}
      </div>
    </form>
  );
};

export default ProductForm;

ProductForm.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  fillTextShown: PropTypes.bool.isRequired,
  isCreateProduct: PropTypes.bool.isRequired,
  existingName: PropTypes.string,
  existingDescription: PropTypes.string,
  existingPrice: PropTypes.string,
  id: PropTypes.string,
  existingImages: PropTypes.array,
  existingCategory: PropTypes.string,
};
