const router = require("express").Router();
const {
    handelCreateNewCategory,
    handelGetAllCategories,
    handelEditCategory,
    handelDeleteCategory,
    handelUpdateProperties
} = require("../controllers/categoriesControllers.js");

router.post("/new-category/:id", handelCreateNewCategory);

router.put("/edit-category/:id", handelEditCategory);

router.delete("/delete-category/:id", handelDeleteCategory);

router.get("/get-all-categories", handelGetAllCategories);

router.put("/update-category-property/:id", handelUpdateProperties);

module.exports = router;