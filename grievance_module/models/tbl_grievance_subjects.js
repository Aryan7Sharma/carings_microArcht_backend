const { DataTypes } = require('sequelize');
const sequelize = require('../config/db_connection');

const GrievanceSubjects = sequelize().define(
    'tbl_grievance_subjects',
    {
        subject_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        subject_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subject_category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        schema: 'master',
        tableName: 'tbl_grievance_subjects',
    }
);

module.exports = GrievanceSubjects;