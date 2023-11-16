const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_connection');

const GrievanceStakeholdersInternalRemarks = sequelize().define(
    'tbl_grievance_stkh_internal_remark',
    {
        grievance_token: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        grievance_sub_token_no: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        grievance_subject_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        user_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        entry_by: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        remark_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        remark: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        upload_doc_path: {
            type: DataTypes.INTEGER,
            defaultValue: 'NA',
        },
        user_ip: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        remark_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        schema: 'public',
        tableName: 'tbl_grievance_stkh_internal_remark',
    }
);

// GrievanceStakeholdersInternalRemarks.belongsTo(sequelize().models.tbl_grievance_subjects, {
//     foreignKey: 'grievance_subject_id',
//     targetKey: 'subject_id',
// });


module.exports = GrievanceStakeholdersInternalRemarks;