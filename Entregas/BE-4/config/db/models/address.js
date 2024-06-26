const sequelize = require("../db.connect");
const {DataTypes} = require("sequelize");
const Candidate = require("./candidate");

const Address = sequelize.define('Address', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    candidate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references : {
            model : Candidate,
            key: 'id'
            }
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    neighborhood: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    street: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    complement: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'addresses',timestamps : false});

module.exports = Address;