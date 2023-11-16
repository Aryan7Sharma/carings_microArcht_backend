const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

// import middlewares

// import controller
const grievanceMainController = require("../controllers/Grievance/index");
const grievanceSearchController = require("../controllers/Grievance/grievance_serach");
const grievanceReportController = require("../controllers/Grievance/reports");

// routes
// mainController
router.get("/getallgrievancesubjects", grievanceMainController.getAllGrievanceSubj);
router.post("/grievanceInternalRemarkEntry", grievanceMainController.stkhInternalRemarkEntry);
router.post("/getGrievanceForStkh", grievanceMainController.getGrievancesForStkh);
router.post("/registergrievance", grievanceMainController.registerGrievance);

// searchController
router.post("/serachgrievance", grievanceSearchController.searchGrievance);
router.post("/getgrievancedetails", grievanceSearchController.getGrievanceDetails);

// reportController
router.post("/getgrievancedetailedrept", grievanceReportController.grievanceDetailedReport);

module.exports = router;