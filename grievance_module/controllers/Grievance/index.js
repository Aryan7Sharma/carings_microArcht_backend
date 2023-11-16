const { env } = process;
const { Op } = require('sequelize');
const sequelizedbConnection = require("../../config/db_connection");
const logger = require("../../config/app_logger");
const { grievanceSubjectsModel, grievanceModel, grievanceStakeholdersModel, grievanceInternalRemarkModel, grievanceResponseModel } = require("../../models/index"); //Models
const { getTokenNumber } = require('../../utils/generateGrievanceToken');
const getAllGrievanceSubj = async (req, res) => {
    try {
        const allGrivSubj = await grievanceSubjectsModel.findAll();
        return res.status(200).send({ status: env.s200, msg: "All Grievance Subjects Fetched Successfully", data: allGrivSubj });
    } catch (error) {
        logger.error(`server error inside getAllGrievanceSubj funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

const getAllGrievanceStkh = async (req, res) => {
    try {
        //console.log("inside",req.headers['x-forwarded-for'], req.connection.remoteAddress);
        const allGrivSubj = await grievanceSubjectsModel.findAll();
        return res.status(200).send({ status: env.s200, msg: "All Grievance Subjects Fetched Successfully", data: allGrivSubj });
    } catch (error) {
        logger.error(`server error inside getAllGrievanceSubj funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};

const registerGrievance = async (req, res) => {
    try {
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const { applicant_type, applicant_reg_on_carings, applicant_regno,
            applicant_name, applicant_gender, applicant_email_id, grievance_subject_code,
            applicant_phone_no, applicant_address, applicant_district_code,
            applicant_state_code, applicant_country_code, grievance_category,
            grievance_type, grievance_against_type, grievance_against_code, grievance
        } = req.body;
        if (applicant_reg_on_carings == 1 && !applicant_regno) { return res.status(404).send({ status: env.s404, msg: "Registraction No is Not Found" }); }
        let grievance_token = await getTokenNumber();
        if (!grievance_token) { return res.status(500).send({ status: env.s500, msg: "Failed to Generate New Grievance Token No" }); }
        if (grievance_category == 0) {
            grievance_token = 'Q' + grievance_token;
        } else if (grievance_category == 1) {
            grievance_token = 'C' + grievance_token;
        } else {
            return res.status(422).send({ status: env.s422, msg: "Grievance Category is Incorrect" });
        }
        console.log("getTokenNumber", grievance_token);
        const grievanceData = {
            grievance_token: grievance_token,
            applicant_type: applicant_type,
            applicant_reg_on_carings: applicant_reg_on_carings,
            applicant_regno: applicant_regno || "NA",
            applicant_name: applicant_name,
            applicant_gender: applicant_gender,
            applicant_email_id: applicant_email_id,
            applicant_phone_no: applicant_phone_no,
            applicant_address: applicant_address,
            applicant_district_code: applicant_district_code,
            applicant_state_code: applicant_state_code,
            applicant_country_code: applicant_country_code,
            grievance_type: grievance_type,
            grievance_status: 0,
            grievance_against_type: grievance_against_type,
            grievance_against_code: grievance_against_code,
            grievance_entry_date: new Date(),
        };
        const grievanceResponceData = {
            grievance_token: grievance_token,
            grievance_sub_token_no: 1,
            grievance_subject_code: grievance_subject_code,
            grievance: grievance,
            grievance_uploaded_doc_path: "NA",//grievance_uploaded_doc_path || "NA",
            grievance_status: 0,
            user_ip: ipAddress,
            responser_ip: "NA",
            grievance_date: new Date(),
        }
        // Start a transaction
        const newGrievanceTransaction = async () => {
            return new Promise(async (resolve, reject) => {
                const transaction = await sequelizedbConnection().transaction(); // Start a new transaction

                try {
                    await grievanceModel.create(grievanceData, { transaction });
                    await grievanceResponseModel.create(grievanceResponceData, { transaction });

                    await transaction.commit(); // Commit the transaction
                    resolve({ status: 'committed' }); // Resolve the Promise to indicate successful commit
                } catch (error) {
                    await transaction.rollback(); // Rollback the transaction in case of an error
                    reject({ status: 'failed', error }); // Reject the Promise with the error
                }
            });
        };
        const newGrievance = await newGrievanceTransaction();
        if (!newGrievance) { return res.status(417).send({ status: env.s417, msg: "Failed to Register New Grievance.", data: [] }); };
        return res.status(200).send({ status: env.s200, msg: "New Grievance Registered Successfully.", data: { grievanceTokenNo: grievance_token } });
    } catch (error) {
        console.log("error", error);
        logger.error(`server error inside registerGrievance funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
}

const stkhInternalRemarkEntry = async (req, res) => {
    try {
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const { grievance_token, grievance_subject_id, user_type, entry_by, remark_type, remark } = req.body;
        const grievance = await grievanceModel.findByPk(grievance_token);
        if (!grievance) { return res.status(404).send({ status: env.s404, msg: "Grievance Not Found!" }); };
        let stakeholderID = parseInt(user_type);
        const stakeholder = await grievanceStakeholdersModel.findByPk(stakeholderID);
        if (!stakeholder) { return res.status(422).send({ status: env.s422, msg: "Invalid Stakeholder or User Type!" }); };
        let subTokenNo = 1;
        const lastInternalRemark = await grievanceInternalRemarkModel.findOne({
            where: { grievance_token: grievance_token },
            order: [['grievance_sub_token_no', 'DESC']],
            limit: 1,
        });
        if (lastInternalRemark) {
            subTokenNo = lastInternalRemark.grievance_sub_token_no + 1;
        }
        const grievanceInternalRemarkData = {
            grievance_token: grievance_token,
            grievance_sub_token_no: subTokenNo,
            grievance_subject_id: grievance_subject_id,
            user_type: user_type,
            entry_by: entry_by,
            remark_type: remark_type,
            remark: remark,
            upload_doc_path: "NA", //upload_doc_path ,
            user_ip: ipAddress || "NA",
            remark_date: new Date(),
        }
        await grievanceInternalRemarkModel.create(grievanceInternalRemarkData);
        return res.status(200).send({ status: env.s200, msg: "Grievance Internal Remark Successfully" });
    } catch (error) {
        logger.error(`server error inside stkhInternalRemarkEntry funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
};


const getGrievancesForStkh = async (req, res) => {
    try {
        const { user_type } = req.body;
        let stakeholderID = parseInt(user_type);
        const stakeholder = await grievanceStakeholdersModel.findByPk(stakeholderID);
        if (!stakeholder) { return res.status(422).send({ status: env.s422, msg: "Invalid Stakeholder or User Type!" }); };
        const grievances = await grievanceModel.findAll({
            where: {
                [Op.or]: [
                    { grievance_against_type: user_type },
                    {
                        grievance_entry_date: {
                            [Op.lte]: new Date(new Date() - 48 * 60 * 60 * 1000), // 48 hours ago
                        },
                    },
                ],
            },
            attributes: ['grievance_token', 'applicant_reg_on_carings', 'applicant_reg_on_carings', 'grievance_status', 'grievance_entry_date'],
        })
        if (!grievances || grievances?.length < 1) { return res.status(404).send({ status: env.s404, msg: "Grievances Not Found!" }); };
        return res.status(200).send({ status: env.s200, msg: "Grievances Details Fetched Successfully.", data: { grievanceDetails: grievances } });
    } catch (error) {
        logger.error(`server error inside getAllGrievanceSubj funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error", error: error });
    }
};

const grievanceFinalResponce = async (req, res) => {
    try {
        const { } = req.body;
        const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        return res.status(200).send({ status: env.s200, msg: "Grievance Internal Remark Successfully" });
    } catch (error) {
        logger.error(`server error inside grievanceFinalResponce funtion${error}`);
        return res.status(500).send({ status: env.s500, msg: "Internal Server Error" });
    }
}
module.exports = {
    getAllGrievanceSubj,
    getAllGrievanceStkh,
    registerGrievance,
    stkhInternalRemarkEntry,
    getGrievancesForStkh
}
