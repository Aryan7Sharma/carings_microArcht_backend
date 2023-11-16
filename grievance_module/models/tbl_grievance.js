const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_connection');

const Grievance = sequelize().define(
    'tbl_grievance',
    {
        grievance_token: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        applicant_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        applicant_reg_on_carings: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        applicant_regno: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        applicant_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        applicant_gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        applicant_email_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        applicant_phone_no: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        applicant_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        applicant_district_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        applicant_state_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        applicant_country_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        grievance_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        grievance_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        grievance_against_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        grievance_against_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        grievance_entry_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        schema: 'public',
        tableName: 'tbl_grievance',
    }
);

module.exports = Grievance;