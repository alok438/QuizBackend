var express = require("express");
var router = express.Router();
const studentController = require("../controller/studentControoler.js");

router.get(
  "/getallquiz",
  studentController.verifyToken,
  studentController.getallquiz
);
router.get(
  "/getallquestion/:id",
  studentController.verifyToken,
  studentController.getAllQuestion
);
module.exports = router;
