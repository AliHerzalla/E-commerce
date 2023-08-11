const router = require("express").Router();
const { handelAddNewPropertiesNames } = require("../controllers/propertiesControllers.js");

router.post("/new-properties-name", handelAddNewPropertiesNames);


module.exports = router;