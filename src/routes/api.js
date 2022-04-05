var express = require("express");
var router = express.Router();
const apiController = require("../controller/apiControoler.js");
require("dotenv").config();

router.post("/registerstudnet", apiController.registerStudent);
router.post("/registerteacher", apiController.registerTeacher);
router.post("/login", apiController.logIn);

router.get("/check", apiController.verifyToken, apiController.getCheck);

router.post("/testdone", apiController.testDone);

module.exports = router;
