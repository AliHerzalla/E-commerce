import ProductForm from "../components/ProductForm";

const NewProduct = () => {
  return (
    <div>
      <ProductForm
        pageTitle={"New Product"}
        fillTextShown={true}
        isCreateProduct={true}
      />
    </div>
  );
};

export default NewProduct;
