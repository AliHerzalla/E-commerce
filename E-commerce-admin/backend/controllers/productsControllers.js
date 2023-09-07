require("dotenv").config();
const { Storage } = require("@google-cloud/storage");
const ProductsModel = require("../models/products.js");
const ProductImagesModel = require("../models/productsImages.js");

const handelCreateNewProduct = async (req, res) => {
    const { id } = req.params;
    const { productName, productDescription, productPrice, productImages, productCategory, productProperties } = req.body;
    try {
        const ProductDoc = await ProductsModel.create({
            id: id,
            product_name: productName,
            product_description: productDescription,
            product_price: productPrice,
            product_category: productCategory,
            product_properties: productProperties,
        }).then(() => {
            if (productImages) {
                productImages.map(async (image) => {
                    await ProductImagesModel.create({
                        product_id: id,
                        image: image
                    });
                });
                return res.status(200).json({
                    message: "Product inserted successfully",
                    product: ProductDoc,
                    productImages: productImages
                });
            } else {
                return res.status(200).json({
                    message: "Product inserted successfully",
                    product: ProductDoc
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Something went wrong, Try again later"
        });
    }
};

const handelGetExistingProductImages = async (req, res) => {
    const { id } = req.params;
    try {
        const ProductImagesDoc = await ProductImagesModel.find({ product_id: id });
        if (ProductImagesDoc) {
            res.status(200).json({
                message: 'Product images found',
                images: ProductImagesDoc
            });
        }
    } catch (error) {
        console.log(error);
        res.status(404).json({
            message: 'Product images not found'
        });
    }
};

const handelGetProducts = async (req, res) => {

    try {
        const ProductsDoc = await ProductsModel.find({});
        if (ProductsDoc) {
            res.status(200).json({
                message: "Get products successfully",
                products: ProductsDoc
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Cannot get products"
        });
    }
};

const handelEditProduct = async (req, res) => {
    const { id } = req.params;
    const { productName, productDescription, productPrice, productCategory, productProperties } = req.body;

    try {
        const ProductsDoc = await ProductsModel.findOneAndUpdate({ id: id }, {
            product_name: productName,
            product_description: productDescription,
            product_price: productPrice,
            product_category: productCategory,
            product_properties: productProperties
        });
        if (ProductsDoc) {
            res.status(200).json({
                message: "Updated product successfully",
                updatedProductInfo: ProductsDoc
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Error when updating product"
        });
    }
};

const handelGetProductToEdit = async (req, res) => {
    const { id } = req.params;

    try {
        const ProductDoc = await ProductsModel.findOne({ id: id });
        if (ProductDoc) {
            res.status(200).json({
                message: "Product found to edit",
                product: ProductDoc
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Cannot find product to edit"
        });
    }
};

const handelGetSingleProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const ProductDoc = await ProductsModel.findOne({ id: id });
        if (ProductDoc) {
            res.status(200).json({
                message: "Product found",
                product: ProductDoc
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Cannot find product"
        });
    }
};

const handelDeleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const ProductDoc = await ProductsModel.findOneAndRemove({ id: id });
        if (ProductDoc) {
            res.status(200).json({ message: "Product deleted successfully" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Something went wrong, Try again later" });
    }
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

const handelAddNewProductImages = async (req, res) => {
    const { id } = req.params;
    const { productImages } = req.body;

    try {
        // Delete existing product images
        await ProductImagesModel.deleteMany({ product_id: id });

        // Insert new product images
        const insertedImages = await ProductImagesModel.insertMany(
            productImages.map((image) => ({
                product_id: id,
                image: image,
            }))
        );

        return res.status(200).json({
            message: "Product images inserted successfully",
            productImages: insertedImages,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something went wrong, please try again later",
        });
    }
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