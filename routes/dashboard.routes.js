const express = require("express");
const router = express.Router();

const {
  getDashboardData,
  downloadReport,
} = require("../controllers/dashboard.controller");

router.get("/", getDashboardData);

router.get(
  "/download-report",
  (req, res, next) => {
    console.log("Download report route accessed");
    next(); // ✅ REQUIRED
  },
  downloadReport
);

module.exports = router;
