const connection = require("../db.js");
require("dotenv").config();
const { Storage } = require("@google-cloud/storage");

const insertNewProductQuery = "INSERT INTO products (id,product_name,product_description,product_price,product_category) VALUES (?,?,?,?,?)";
const searchProductsQuery = "SELECT * FROM products";
const updateProductQuery = "UPDATE products SET product_name = ?, product_description = ?, product_price = ?, product_category = ? WHERE id = ?";
const searchSpecificProductQuery = "SELECT * FROM products WHERE id = ?";
const deleteProductQuery = "DELETE FROM products WHERE id = ?";
const insertNewProductImagesQuery = "INSERT INTO products_images (image,product_id) VALUES (?,?)";
const searchProductsImagesQuery = "SELECT image FROM products_images WHERE product_id = ?";
const insertEditProductImagesQuery = "INSERT INTO products_images (image,product_id) VALUES (?, ?)";
const deleteProductImagesQuery = "DELETE FROM products_images WHERE product_id = ?";


const handelCreateNewProduct = (req, res) => {
    const { id } = req.params;
    const { productName, productDescription, productPrice, productImages, productCategory } = req.body;
    const values = [id, productName, productDescription, productPrice, productCategory];
    connection.promise().execute(insertNewProductQuery, values, async (error, result) => {
        if (error) {
            res.status(400).json({
                message: "Something went wrong, Try again later"
            });
        }
    }).then(() => {
        if (productImages) {
            productImages.map((image) => {
                const values = [image, id];
                connection.execute(insertNewProductImagesQuery, values, (error, result) => {
                    if (error) {
                        res.status(400).json({
                            message: "Something went wrong, Try again later"
                        });
                    }
                });
            });
            return res.status(200).json({
                message: "Product inserted successfully",
                product: productImages
            });
        } else {
            return res.status(200).json({
                message: "Product inserted successfully",
                product: result[0]
            });
        }
    });
};

const handelGetExistingProductImages = (req, res) => {
    const { id } = req.params;

    const values = [id];
    connection.execute(searchProductsImagesQuery, values, (error, result) => {
        if (error) {
            console.log(error);
            res.status(404).json({
                message: 'Product images not found'
            });
        }
        res.status(200).json({
            message: 'Product images found',
            images: result
        });
    });
};

const handelGetProducts = (req, res) => {
    connection.execute(searchProductsQuery, (error, result) => {
        if (error) {
            res.status(400).json({
                message: "Cannot get products"
            });
        } else {
            res.status(200).json({
                message: "Get products successfully",
                products: result
            });
        }
    });
};

const handelEditProduct = (req, res) => {
    const { id } = req.params;
    const { productName, productDescription, productPrice, productCategory } = req.body;
    const values = [productName, productDescription, productPrice, productCategory, id];

    connection.execute(updateProductQuery, values, (error, result) => {
        if (error) {
            res.status(400).json({
                message: "Error when updating product"
            });
        } else {
            res.status(200).json({
                message: "updated product successfully",
                updatedProductInfo: result[0]
            });
        }
    });
};

const handelGetProductToEdit = (req, res) => {
    const { id } = req.params;
    const values = [id];
    connection.execute(searchSpecificProductQuery, values, (error, result) => {
        if (error) {
            res.status(400).json({
                message: "Cannot find product to edit"
            });
        } else {
            res.status(200).json({
                message: "Product found to edit",
                product: result[0]
            });
        }
    });
};

const handelGetSingleProduct = (req, res) => {
    const { id } = req.params;
    const values = [id];
    connection.execute(searchSpecificProductQuery, values, (error, result) => {
        if (error) {
            res.status(400).json({
                message: "Cannot find product"
            });
        } else {
            res.status(200).json({
                message: "Product found",
                product: result[0]
            });
        }
    });
};

const handelDeleteProduct = (req, res) => {
    const { id } = req.params;
    const values = [id];

    connection.execute(deleteProductQuery, values, (error, result) => {
        if (error) {
            res.status(400).json({ message: "Something went wrong, Try again later" });
        } else {
            res.status(200).json({ message: "Product deleted successfully" });
        }
    });
};

const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_STORAGE_BUCKET_PROJECT_ID,
    keyFilename: "google_cloud_storage_key.json"
});
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET_NAME);

let imageLink;
const handelAddProductImagesToBucket = async (req, res) => {
    try {
        await Promise.all(
            req.files.map(async (file) => {
                const { originalname, buffer } = file;
                const fileName = Date.now() + "_" + originalname;
                const fileBlob = bucket.file(fileName);

                const blobStream = fileBlob.createWriteStream({
                    resumable: false
                });

                blobStream.on("error", (err) => {
                    console.error(err);
                    throw new Error("Failed to upload Images to Google Cloud Storage");
                });

                const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileBlob.name}`;
                imageLink = publicUrl;
                blobStream.end(buffer);
            })
        );
        return res.status(200).json({
            message: `1 Image uploaded successfully`,
            image: imageLink,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to upload Images" });
    }
};

const handelAddNewProductImages = (req, res) => {
    const { id } = req.params;
    const { productImages } = req.body;

    const values = [id];
    connection.promise().execute(deleteProductImagesQuery, values, (error, result) => {
        if (error) {
            res.status(404).json({
                message: "Something went wrong, please try again later"
            });
        }
    }).then(() => {
        productImages.map((image) => {
            const values = [image, id];
            connection.execute(insertEditProductImagesQuery, values, (error, result) => {
                if (error) {
                    res.status(400).json({
                        message: "Something went wrong, Try again later"
                    });
                }
            });
        });
        return res.status(200).json({
            message: "Product inserted successfully",
            product: productImages
        });
    });
};

module.exports = {
    handelCreateNewProduct,
    handelGetProducts,
    handelEditProduct,
    handelGetProductToEdit,
    handelDeleteProduct,
    handelGetSingleProduct,
    handelAddProductImagesToBucket,
    handelGetExistingProductImages,
    handelAddNewProductImages
}; 