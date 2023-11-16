const grievanceSubjectsModel = require("./tbl_grievance_subjects");
const grievanceStakeholdersModel = require("./tbl_grievances_stakeholders");
const grievanceModel = require("./tbl_grievance");
const grievanceResponseModel = require("./tbl_grievance_response");
const grievanceInternalRemarkModel = require("./tbl_grievance_stkh_internal_remark");



module.exports = {
    grievanceSubjectsModel,
    grievanceStakeholdersModel,
    grievanceModel,
    grievanceResponseModel,
    grievanceInternalRemarkModel,
}