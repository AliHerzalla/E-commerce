const router = require("express").Router();
const {
    handelAddNewProperties,
    handelGetSpecificProperties,
    handelDeleteProperties,
} = require("../controllers/propertiesControllers.js");

router.post("/new-properties-name", handelAddNewProperties);

router.get("/get-specific-properties/:id", handelGetSpecificProperties);

router.delete("/delete-properties/:id", handelDeleteProperties);

module.exports = router;