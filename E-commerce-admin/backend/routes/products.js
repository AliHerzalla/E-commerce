const router = require("express").Router();
const Multer = require('multer');

const {
    handelCreateNewProduct,
    handelGetProducts,
    handelEditProduct,
    handelGetProductToEdit,
    handelDeleteProduct,
    handelGetSingleProduct,
    handelAddProductImagesToBucket,
    handelAddNewProductImages,
    handelGetExistingProductImages
} = require("../controllers/productsControllers.js");

const multer = Multer({
    storage: Multer.memoryStorage()
});

router.post("/new-product/:id", handelCreateNewProduct);

router.get("/get-products", handelGetProducts);

router.put("/edit/:id", handelEditProduct);

router.get("/edit/:id", handelGetProductToEdit);

router.get("/get/:id", handelGetSingleProduct);

router.delete("/delete/:id", handelDeleteProduct);

router.post("/add-products-images", multer.array("image", 20), handelAddProductImagesToBucket);

router.put("/add-new-product-images/:id", handelAddNewProductImages);

router.get("/edit/get-images/:id", handelGetExistingProductImages);


module.exports = router;