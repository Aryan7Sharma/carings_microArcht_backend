const { env } = process;
const { Op } = require('sequelize');
const logger = require("../../config/app_logger");
const { grievanceSubjectsModel, grievanceModel, grievanceResponseModel, grievanceInternalRemarkModel } = require("../../models/index"); //Models

const getGrievanceDetailViaTokenNo = async (token) => {
    try {
        const grievances = await grievanceModel.findByPk(token, {
            attributes: ['grievance_token', 'applicant_name', 'applicant_phone_no', 'grievance_status', 'grievance_entry_date'],
        });
        return grievances;
    } catch (error) {
        logger.error(`server error inside getGrievanceDetailViaTokenNo funtion${error}`);
    }
};

const getGrievanceDetailViaName = async (name) => {
    try {
        const grievances = await grievanceModel.findAll({
            where: {
                applicant_name: {
                    [Op.like]: `%${name}%`
                }
            },
            attributes: ['grievance_token', 'applicant_name', 'applicant_phone_no', 'grievance_status', 'grievance_entry_date'],
        });
        return grievances;
    } catch (error) {
        logger.error(`server error inside getGrievanceDetailViaName funtion${error}`);
    }
};

const getGrievanceDetailViaPhoneNo = async (phoneno) => {
    try {
        const grievances = await grievanceModel.findAll({
            where: {
                applicant_phone_no: phoneno
            },
            attributes: ['grievance_token', 'applicant_name', 'applicant_phone_no', 'grievance_status', 'grievance_entry_date'],
        }
        );
        return grievances;
    } catch (error) {
        logger.error(`server error inside getGrievanceDetailViaPhoneNo funtion${error}`);
    }
};

const getGrievanceDetailViaEmailId = async (emailId) => {
    try {
        const grievances = await grievanceModel.findAll({
            where: {
                applicant_email_id: emailId
            },
            attributes: ['grievance_token', 'applicant_name', 'applicant_phone_no', 'grievance_status', 'grievance_entry_date'],
        });
        return grievances;
    } catch (error) {
        logger.error(`server error inside getGrievanceDetailViaEmailId funtion${error}`);
    }
};


const searchGrievance = async (req, res) => {
    try {
        const { token, name, phone_no, email_id } = req.body;
        let { search_by } = req.body;
        search_by = search_by ? parseInt(search_by) : null;
        let grievances = null;
        if (search_by === 0) {
            if (!token) { return res.status(404).send({ status: env.s404, msg: "Token Not Found!" }); };
            grievances = await getGrievanceDetailViaTokenNo(token);
        }
        else if (search_by === 1) {
            console.log("inside")
            if (!name) { return res.status(404).send({ status: env.s404, msg: "Name Not Found!" }); };
            grievances = await getGrievanceDetailViaName(name);
        }
        else if (search_by === 2) {
            if (!phone_no) { return res.status(404).send({ status: env.s404, msg: "Phone No Not Found!" }); };
            grievances = await getGrievanceDetailViaPhoneNo(phone_no);
        } else if (search_by === 3) {
            if (!email_id) { return res.status(404).send({ status: env.s404, msg: "Email ID Not Found!" }); };
            grievances = await getGrievanceDetailViaEmailId(email_id);
        }
        else { return res.status(422).send({ status: env.s422, msg: "Invalid Search Parameter!" }); };
        if (!grievances) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        return res.status(200).send({ status: env.s200, msg: "Grievances Details Fetched Successfully.", data: { searchedGrievances: grievances } });
    } catch (error) {
        logger.error(`server error inside getAllGrievanceSubj funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

const getGrievanceDetails = async (req, res) => {
    try {
        const { grievance_token } = req.body;
        if (!grievance_token) { return res.status(404).send({ status: env.s404, msg: "Grievance Token Not Found!" }); };
        const grievance = await grievanceModel.findByPk(grievance_token);
        if (!grievance) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        const grievance_resp = await grievanceResponseModel.findAll({ where: { grievance_token: grievance_token } });
        const grievanceInternalRemark = await grievanceInternalRemarkModel.findAll({
            where: {
                grievance_token: grievance_token
            }
        });
        return res.status(200).send({ status: env.s200, msg: "Grievance Details Fetched Successfully.", data: { grievanceDetails: grievance, grievanceResponceDetails: grievance_resp, grievanceInternalRemark: grievanceInternalRemark } });
    } catch (error) {
        logger.error(`server error inside getAllGrievanceSubj funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

module.exports = {
    searchGrievance,
    getGrievanceDetails
};
