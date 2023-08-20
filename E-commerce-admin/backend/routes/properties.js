const router = require("express").Router();
const {
    handelAddNewPropertiesNames,
    handelEditExistingProperties,
    handelGetSpecificProperties,
} = require("../controllers/propertiesControllers.js");

router.post("/new-properties-name", handelAddNewPropertiesNames);

router.put("/edit-exiting-properties/:id", handelEditExistingProperties);

router.get("/get-specific-properties/:id", handelGetSpecificProperties);


module.exports = router;