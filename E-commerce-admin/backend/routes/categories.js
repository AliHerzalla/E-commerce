const router = require("express").Router();
const {
    handelCreateNewCategory,
    handelGetAllCategories,
    handelEditCategory,
    handelDeleteCategory
} = require("../controllers/categoriesControllers.js");

router.post("/new-category", handelCreateNewCategory);

router.put("/edit-category/:id", handelEditCategory);

router.delete("/delete-category/:id", handelDeleteCategory);

router.get("/get-all-categories", handelGetAllCategories);

module.exports = router;